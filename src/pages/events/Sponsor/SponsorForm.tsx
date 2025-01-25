import React, { useEffect,useState } from 'react';
import { Typography, IconButton, Avatar } from '@mui/material';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from "@mui/material/Grid2";
import CustomButton from '@/components/CustomButton/CustomButton';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import CustomAutocomplete from '@/components/CustomAutocomplete/CustomAutocomplete';
import { UseFormSetValue } from 'react-hook-form';
import { POST } from '@/Libs/store';
import { Logger } from '@/Utils/Logger';

interface SponsorFormProps {
  index: number;
  control: any;
  setValue: UseFormSetValue<any>;
  addSponsor: (index: number) => void;
  removeSponsor: (item: any, index: number) => void;
  handleSearch: (searchTerm: string) => void;
  searchResults: any[];
  loading: boolean;
  watch: any;
  setShowSponsorSection?: (value: boolean) => void;
  setNewSpeakerDrawerOpen: (value: boolean) => void;
  baseUrl: string;
}
interface SponosrType{
  value:number,
  label:string
}
const SponsorForm: React.FC<SponsorFormProps> = ({
  index,
  control,
  setValue,
  addSponsor,
  removeSponsor,
  handleSearch,
  searchResults,
  loading,
  watch,
  setShowSponsorSection,
  setNewSpeakerDrawerOpen,
  baseUrl,
}) => {

  const truncateString = (str: string, length: number) => {
    return str.length > length ? str.substring(0, length) + '...' : str;
  };
  useEffect(() => {
    getSponsorType();
  }, [])
  const [sponsorType,setSponsorType]=useState();


  const getSponsorType=async()=>{
    POST({
      url: "sponsorType/list",
      id: "programSponsorType",
      body: {},
      successCB: (context: any) => {
        console.log(context,'context of sponsor type is here>>>>>>')
        let _sponsorType:any=[];
        context.data.forEach((item: any) => {
          _sponsorType.push({
            value: item?.id,
            label: item?.name
          })
        })
        console.log(sponsorType,'sponsorType is here>>>>>>')
        setSponsorType(_sponsorType);
        // setSearchResults(transformUserData(context?.data))
        // setLoading(false);
      },
      errorCB: (context: any) => {
        Logger.error("Error fetching search results:", context?.message);
        // setLoading(false);
      }
    })
  }
  return (
    <Grid container size={{ xs: 12, sm: 12 }} p={{ xs: 1, sm: 2 }} className="add-program-speaker-section">
      {/* speaker add section */}
      <Grid
        size={{ xs: 12 }}
        container
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography className="add-program-drawer-heading">Assign Sponsor</Typography>
        {/* <IconButton onClick={() => setShowSponsorSection(false)}> */}
          <CloseOutlined />
        {/* </IconButton> */}
      </Grid>

      {/* speaker selection */}
      <Grid size={{ xs: 12 }}>
        <CustomAutocomplete
          name={`programs.${index}.sponosrSelection`}
          control={control}
          placeholder="Search Speaker"
          options={searchResults}
          getOptionLabel={(option: any) => option.sponsorFullName || ''}
          onSearch={handleSearch}
          loading={loading}
          onChange={(selectedOption:any) => {
            setValue(`programs.${index}.sponsorId`, selectedOption?.speakerId);
            setValue(`programs.${index}.speakerLogoId`, selectedOption?.speakerLogoId);
            setValue(`programs.${index}.sponsorFullName`, selectedOption?.sponsorFullName);
          }}
        />
      </Grid>

      {/* New speaker link */}
      <Grid
        container
        className="add-program-drawer-new-speaker-link"
        justifyContent={'end'}
        onClick={() => setNewSpeakerDrawerOpen(true)}
        size={{ xs: 12 }}
      >
        <Typography className="cursor-container" variant="h6">Create New Sponsor?</Typography>
      </Grid>

      {/* Designation field */}
      {/* <Grid size={{ xs: 12 }}>
        <CustomTextField
          placeholder="Designation"
          control={control}
          name={`programs.${index}.designation`}
          type="text"
        />
      </Grid> */}

      {/* Assign Speaker button */}
      <Grid size={{ xs: 12 }}>
        <CustomButton
          className="add-program-drawer-btn-cancel"
          label="Assign Speaker"
          variant="outlined"
          size="large"
          onClick={() => addSponsor(index)}
        />
      </Grid>

      {/* Sponsors list */}
      {watch(`programs.${index}.sponsors`)?.length !== 0 && (
        <Grid container flexDirection={"column"} className="add-program-speaker-section-card-container" size={{ xs: 12 }}>
          <Grid container spacing={1}>
            {watch(`programs.${index}.sponsors`)?.map((item:any, speakerIndex:any) => {
              return (
                <Grid size={{ xs: 12 }} key={speakerIndex + "grid"} container alignItems="center" className="add-program-speaker-section-card-item" p={1}>
                  <Grid size={{ xs: 2 }} justifyItems={'center'}>
                    <Avatar
                      alt={item.speakerFullName}
                      src={item?.speakerAssetId
                        ? `${baseUrl}asset/${item?.speakerAssetId}`
                        : ""}
                    />
                  </Grid>
                  <Grid size={{ xs: 8 }} justifyItems={'start'}>
                    <Typography className="add-program-speaker-section-card-item-title">
                      {item.speakerFullName}
                    </Typography>
                    {/* <Typography className="add-program-speaker-section-card-item-subtitle">
                      {truncateString(item?.designation, 35)}
                    </Typography> */}
                  </Grid>
                  <Grid size={{ xs: 2 }} justifyItems={'center'}>
                    <IconButton
                      onClick={() => removeSponsor(item, index)} 
                      sx={{ padding: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default SponsorForm;


