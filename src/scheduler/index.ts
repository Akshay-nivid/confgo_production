import cron from 'node-cron';
import { NotificationJob } from '../services/NotificationJob';
import { redlock } from '../scheduler/redis'; // Import Redis configuration

// This function will be called from app.ts to start the cron job


export const startScheduler = () => {

  console.log('Starting scheduler...');

  // Define the cron job
 cron.schedule('*/1 * * * *', async () => {
    // Every 2 minutes
    console.log('Triggering Event Participate Email sending...');
    try {
      // Acquire the lock for Job A
      const lock = await redlock.lock('locks:jobA', 5000); // Lock expires after 5 seconds

      try {
        // Process your job (example: processing unsent notifications)
       await NotificationJob.processUnsentNotifications();
       await NotificationJob.processUpdateExpiredSubscription();
      } finally {
        // Release the lock after job is done
        await lock.unlock();
      }
    } catch (error: any) {
      if (error.name === 'LockError') {
        console.log('Job is already running, skipping...');
      } else {
        console.error('Error processing notifications:', error);
      }
    }
  });

  //Schedule the job to run daily at 11:40 AM
  cron.schedule('23 14 * * *',async () => {
      let lock: any;
      console.log('Reminder Email Notification for participants');
      try {
        // Acquire the lock for Job B
        lock = await redlock.lock('locks:jobB', 30000); // Lock expires after 60 seconds
        console.log('Lock acquired for Job B');
  
        // Process Event Reminder Notifications
        await NotificationJob.processExpiringSubscriptions();
        await NotificationJob.processExpiringEventStatus();
        await NotificationJob.getAllUpcomingEvents();
      } catch (error: any) {
        if (error.name === 'LockError') {
          console.log('Job is already running, skipping...');
        } else {
          console.error('Error processing reminder notifications:', error);
        }
      } finally {
        // Release the lock after the job is done
        if (lock) {
          try {
            await lock.unlock();
            console.log('Lock released for Job B');
          } catch (unlockError) {
            console.error('Error releasing lock for Job B:', unlockError);
          }
        }
      }
    },
    {
      scheduled: true,
      timezone: 'Asia/Kolkata', // Change this to your required timezone
    }
  );

};
