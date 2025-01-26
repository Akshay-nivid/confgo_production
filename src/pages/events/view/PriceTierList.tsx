import CustomButton from "@/components/CustomButton/CustomButton";
import { CircularProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import PricingTierConfigure from "./PricingTierConfigure";
import { useEffect, useMemo, useState } from "react";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import useStore from "@/Libs/store/store";
import PricingTable from "./PricingTable";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Logger } from "@/Utils/Logger";

interface PricingTier {
  id: number;
  tierName: string;
  percentage?: number;
  endDate: string;
  startDate: string;
}

interface Attendee {
  id: number;
  attendeeName: string;
  attendeeDescription: string;
  pricingTiers?: PricingTier[];
}
/**
 * Component used to show the list of price tier
 * @param param0
 * @returns
 */
const PriceTierList: React.FC = () => {
  const priceTier = useStore((state) => state?.compData?.["priceTier"]) ?? {};
  const drawerOpen = priceTier.drawerOpen ?? false;
  const setDataById = useStore((state) => state.setDataById);
  const { control } = useForm(); // Use useForm to manage form state
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [_loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const POST = useStore((state: any) => state.POST);

  // Handle opening the dialog
  const handleOpen = () => {
    setDataById("priceTier", { drawerOpen: true });
  };

  // The fetch function
  const fetchPricingTiers = async () => {
    try {
      setLoading(true);

      const priceTierResponse = await POST({
        url: "event/priceTier/list",
        body: { filters: { eventId: id } },
        id: "priceTier",
      });

      const attendeeTypeResponse = await POST({
        url: "participant/type/list",
        body: { filters: { eventId: id,isContributor: '0',exceptName:'General' } },
        id: "attendeeType",
      });

      if (priceTierResponse.status && attendeeTypeResponse.status) {
        const processedData = mapData(
          priceTierResponse.data,
          attendeeTypeResponse.data
        );

        setPricingTiers(processedData.pricingTiers);
        setAttendees(processedData.attendees);
      } else {
        Logger.error(
          "API responses unsuccessful",
          priceTierResponse,
          attendeeTypeResponse
        );
      }
    } catch (error) {
      Logger.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Function to close the drawer
   * @returns
   */
  const closeDrawer = () => {
    setDataById("priceTier", { drawerOpen: false });
    fetchPricingTiers(); 
  }

  /**
   * Used to fetch the data from the apis
   */
  useEffect(() => {
    fetchPricingTiers();
  }, [id]);

  /**
   * Mapp the response of attendee type and price tier aaccording to the ParticipantTypeId in the response
   * @param priceTiersData
   * @param attendeeData
   * @returns
   */
  function mapData(priceTiersData: any[], attendeeData: any[]) {
    // Map pricing tiers
    const mappedPricingTiers = priceTiersData.map((tier) => ({
      id: tier.participantTypeId,
      tierName: tier.name,
      percentage: tier.percentage,
      endDate: tier.endDate,
      startDate: tier.startDate,
    }));

    // Map attendees with their corresponding pricing tiers
    const mappedAttendees = attendeeData.map((attendee) => ({
      id: attendee.id,
      attendeeName: attendee.name,
      attendeeDescription: attendee.description,
      pricingTiers: mappedPricingTiers.filter(
        (tier) => tier.id === attendee.id 
      ),
    }));

    return { pricingTiers: mappedPricingTiers, attendees: mappedAttendees };
  }

  /**
   * Method used to show list
   */
  const pricingList = useMemo(() => {
    return <PricingTable
      control={control}
      pricingTiers={pricingTiers}
      attendees={attendees}
      isListView={true}
    />
  }, 
  [JSON.stringify(attendees), JSON.stringify(pricingTiers)])

  return (
    <>
     {_loading ? (
      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '50vh' }}>
        <CircularProgress />
      </Grid>
    ) : (
    <Grid container spacing={3} className="event-sessions-sessions-container">
      <Grid
        size={{ xs: 12 }}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h3" className="event-detail-event-info-card-title">
          Configurations
        </Typography>
        <CustomButton
          className="event-sessions-sessions-container-add-addon-button"
          variant="outlined"
          label="Configure"
          onClick={handleOpen}
        />
      </Grid>
      <Grid size={'grow'}>
        {/* Conditionally render the text or table based on data */}
        {!pricingTiers.length || !attendees.length ? (
          <>
            <Grid>
              <Typography className="registration-fee-list-sub-heading">
                No Registration Fee Structure Added Yet
              </Typography>
            </Grid>
            <Typography
              variant="h6"
              className="event-detail-speakers-card-speaker-content"
            >
              Get started by adding attendee types like ‘Student’ or
              ‘Professional’ to categorize your participants. Add pricing tiers
              to manage ticket prices for each type—perfect for early bird or
              standard rates.
            </Typography>
          </>
        ) : (
          // Show the pricing table if data is available
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Typography className="registration-fee-list-sub-heading">
                Registration Fee Structure
              </Typography>
             {pricingList}
            </Grid>
          </Grid>
        )}
      </Grid>

      <CustomDrawer
        open={drawerOpen}
        type="right"
        children={<PricingTierConfigure closeDrawer={closeDrawer} hasPricingTiers={pricingTiers.length > 0 && attendees.length > 0} />}
      />
    </Grid>
    )}
    </>
  );
};

export default PriceTierList;
