
interface EventTypeProps{
    status:string,
    className:string
}


const EventTypeText = ({status,className}:EventTypeProps) => {
  /**
   * Get the status text class based on the status
   * @param status 
   */
  const getStatusTextClass = (status:any) => {
    switch (status) {
      case 'OFFLINE':
        return 'offline';
      case 'ONLINE':
        return 'online';
      case 'HYBRID':
        return 'hybrid';
      default:
        return 'default';
    }
  };

  return (
    <div className={className}>
      <span className={`text ${getStatusTextClass(status)}`}>
        {status}
      </span>
    </div>
  );
};

export default EventTypeText;
