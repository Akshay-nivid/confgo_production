import React, { useEffect, useState } from 'react';
import { Typography, IconButton, Avatar } from '@mui/material';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from "@mui/material/Grid2";
import CustomButton from '@/components/CustomButton/CustomButton';
import CustomAutocomplete from '@/components/CustomAutocomplete/CustomAutocomplete';
import { UseFormSetValue } from 'react-hook-form';
import { POST } from '@/Libs/store';
import { Logger } from '@/Utils/Logger';
import CustomSelect from '@/components/CustomSelectBox/CustomSelect';
/**
 * Component for Sponosr Assign for addon
 */
interface SponsorAddonFormProps {
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
    sponsorDrawerhandle: () => void;
    baseUrl: string;
    sponsorSectionShow: () => void;
}
interface SponosrType {
    value: number,
    label: string
}
const SponsorAddonForm: React.FC<SponsorAddonFormProps> = ({
    index,
    control,
    setValue,
    addSponsor,
    removeSponsor,
    handleSearch,
    searchResults,
    loading,
    watch,
    sponsorDrawerhandle,
    baseUrl,
    sponsorSectionShow
}) => {

    useEffect(() => {
        getSponsorType();
    }, [])
    const [sponsorType, setSponsorType] = useState<SponosrType[]>([]);

    /**
     * get different type of sponsor type
     */
    const getSponsorType = async () => {
        POST({
            url: "sponsorType/list",
            id: "programSponsorType",
            body: {},
            successCB: (context: any) => {
                let _sponsorType: any = [];
                context.data.forEach((item: any) => {
                    _sponsorType.push({
                        value: item?.id,
                        label: item?.name
                    })
                })
                setSponsorType(_sponsorType);
            },
            errorCB: (context: any) => {
                Logger.error("Error fetching search results:", context?.message);
            }
        })
    }
    return (
        <Grid spacing={2} container size={{ xs: 12, sm: 12 }} p={{ xs: 1, sm: 2 }} className="add-program-speaker-section">
            {/* sponosr add section */}
            <Grid
                size={{ xs: 12 }}
                container
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography className="add-program-drawer-heading">Assign Sponsor</Typography>
                <IconButton onClick={sponsorSectionShow}>
                    <CloseOutlined />
                </IconButton>
            </Grid>

            {/* speaker selection */}
            <Grid size={{ xs: 12 }}>
                <CustomAutocomplete
                    name={`addOn.${index}.sponosrSelection`}
                    control={control}
                    placeholder="Search Speaker"
                    options={searchResults}
                    getOptionLabel={(option: any) => option.sponsorFullName || ''}
                    onSearch={handleSearch}
                    loading={loading}
                    onChange={(selectedOption: any) => {
                        setValue(`addOn.${index}.sponsorId`, selectedOption?.sponsorId);
                        setValue(`addOn.${index}.sponsorLogoId`, selectedOption?.sponsorLogoId);
                        setValue(`addOn.${index}.sponsorFullName`, selectedOption?.sponsorFullName);
                    }}
                />
            </Grid>
            {/* New speaker link */}
            <Grid
                container
                className="add-program-drawer-new-speaker-link"
                justifyContent={'end'}
                onClick={sponsorDrawerhandle}
                size={{ xs: 12 }}
            >
                <Typography className="cursor-container" variant="h6">Create New Sponsor?</Typography>
            </Grid>
            <CustomSelect
                fullWidth
                className="add-program-select"
                name={`addOn.${index}.sponsorTypeId`}
                control={control}
                label="Sponsor type"
                options={sponsorType}
                onChange={(_value: any) => { }}
            />
            {/* Assign Speaker button */}
            <Grid size={{ xs: 12 }}>
                <CustomButton
                    className="add-program-drawer-btn-cancel"
                    label="Assign Sponsor"
                    variant="outlined"
                    size="large"
                    onClick={() => addSponsor(index)}
                />
            </Grid>
            {/* Sponsors list */}
            {watch(`addOn.${index}.sponsor`)?.length !== 0 && (
                <Grid container flexDirection={"column"} className="add-program-speaker-section-card-container" size={{ xs: 12 }}>
                    <Grid container spacing={1}>
                        {watch(`addOn.${index}.sponsor`)?.map((item: any, speakerIndex: any) => {
                            return (
                                <Grid size={{ xs: 12 }} key={speakerIndex + "grid"} container alignItems="center" className="add-program-speaker-section-card-item" p={1}>
                                    <Grid size={{ xs: 2 }} justifyItems={'center'}>
                                        <Avatar
                                            alt={item.sponsorFullName}
                                            src={item?.sponsorAssetId
                                                ? `${baseUrl}asset/${item?.sponsorAssetId}`
                                                : ""}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 8 }} justifyItems={'start'}>
                                        <Typography className="add-program-speaker-section-card-item-title">
                                            {item.sponsorFullName}
                                        </Typography>
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

export default SponsorAddonForm;


