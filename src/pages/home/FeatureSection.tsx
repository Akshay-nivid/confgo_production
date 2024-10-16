import CustomButton from "@/components/CustomButton/CustomButton";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import FeatureCard from "./FeatureCard";
import { ArrowIconSvg, SecureTransaction, FlexiblePaymentOptions, ScalableMember, EndlessEvent, StreamlinedRegistration, RealTimeTracking } from "@/assets/svg";

/**
 * feature section ui component for home page
 *
 */


const features = [
  {
    title: "Online Payments Support(Support all type payments)",
    flexDirection: "row",
    className: "card-1",
    description: "Experience seamless transactions with our comprehensive online payment support. We cater to all payment types, ensuring hassle-free experiences for both customers and businesses. Whether it's credit cards, debit cards, digital wallets, or bank transfers, our system is designed to handle them all with ease. Enjoy secure, efficient, and swift processing for every transaction, providing peace of mind and convenience. Let us simplify your payment process, so you can focus on what matters most—growing your business.",
    features: [
      {
        key: "Flexible Payment Options",
        title: "Flexible Payment Options",
        description: "Accept various payment methods, including credit/debit cards, digital wallets, and bank transfers, ensuring convenience for all attendees.",
        icon: <FlexiblePaymentOptions className="feature-card__feature-icon" />
      },
      {
        key: "Secure Transactions",
        title: "Secure Transactions",
        description: "Our platform utilizes advanced encryption to protect payment information, providing peace of mind for both organizers and participants.",
        icon: <SecureTransaction className="feature-card__feature-icon" />

      },
    ]
  },
  // 
  {
    title: "Unlimited conference & Members",
    flexDirection: "row-reverse",
    className: "card-2",
    description: "Unlock boundless possibilities with our unlimited conference and member capacities. Host gatherings of any size effortlessly, whether it's a small meeting or a large-scale event. Our platform is designed to accommodate your growing needs, providing seamless support for unlimited participants. Enjoy the freedom to expand your community, network, and collaborations without restrictions. With robust features and scalable solutions, managing conferences and memberships has never been easier. Embrace the potential for growth and connection with our limitless capabilities.",
    features: [
      {
        key: "Endless Event Possibilities",
        title: "Endless Event Possibilities",
        description: "Host an unlimited number of conferences, enabling you to cater to various topics and audiences without restrictions.",
        icon: <EndlessEvent className="feature-card__feature-icon" />
      },
      {
        key: "Scalable Member Management",
        title: "Scalable Member Management",
        description: "Effortlessly manage an infinite number of members, facilitating effective communication and engagement for all your events.",
        icon: <ScalableMember className="feature-card__feature-icon" />

      },
    ]
  },
  // 3
  {
    title: "Registration Management",
    className: "card-3",
    flexDirection: "row",
    description: "Simplify your event registration process with our comprehensive Registration Management feature. Easily set up and customize registration forms to capture all the necessary attendee information. Automate confirmations, reminders, and updates to keep participants informed. Track registrations in real-time, manage attendee lists, and handle payments seamlessly. Ensure a smooth and efficient experience for both organizers and attendees, reducing manual work and minimizing errors. Streamline your event planning with a user-friendly, all-in-one registration solution.",
    features: [
      {
        key: "Streamlined Registration Process",
        title: "Streamlined Registration Process",
        description: "Simplify attendee sign-ups with customizable forms and automated confirmation emails, ensuring a smooth experience from start to finish.",
        icon: <StreamlinedRegistration className="feature-card__feature-icon" />
      },
      {
        key: "Real-Time Tracking",
        title: "Real-Time Tracking",
        description: "Monitor registrations in real-time, allowing you to manage attendee lists effectively and make informed decisions leading up to your event.",
        icon: <RealTimeTracking className="feature-card__feature-icon" />

      },
    ]
  }
]
const FeatureSection = () => {
  return (
    <Grid container className="feature-section-main">
      <Grid size={1}></Grid>
      <Grid container size={10}>
        <Grid size={12} className="feature-section-main__header">
          <Typography
            textAlign={"center"}
            className="feature-section-main__header-title text-h5 font-700"
          >
            Powerful Features for Seamless Conferences
          </Typography>
          <Typography
            className="feature-section-main__header-description text-p1"
            textAlign={"center"}
          >
            Discover the tools that enhance your meetings and elevate your
            events.
          </Typography>
          <Box className="feature-section-main__header-button-container">
            <CustomButton
              label="See All Features"
              className="feature-section-main__header-button-container-feature-all-button"
              variant="outlined"
              endIcon={<ArrowIconSvg/>}
            />
          </Box>
        </Grid>

        
        {
          features.map((feature)=>(
            <FeatureCard className={feature.className}  flexDirection={feature.flexDirection as "row" | "row-reverse"} title={feature.title} description={feature.description} features={feature.features} />
          ))
        }
      </Grid>
      <Grid size={1}></Grid>
    </Grid>
  );
};

export default FeatureSection;
