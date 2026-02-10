/**
 * TemplateCustomizeCard
 * This component handles the customization of the template
 */
import CustomButton from "@/components/CustomButton/CustomButton";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import TemplateContainer from "../template";
import { useState } from "react";
import { PUT } from "@/Libs/store";
import { Logger } from "@/Utils/Logger";

interface TemplateCustomizeCardProps {
    metaData: any;
    onCancel: () => void;
    onSubmitHandler: () => void;
}
const themes = [
    { id: "2", className: "items1" },
    { id: "3", className: "items2" },
    { id: "4", className: "items3" },
    { id: "5", className: "items4" },
];

const TemplateCustomizeCard: React.FC<TemplateCustomizeCardProps> = ({ metaData, onCancel, onSubmitHandler }) => {

    const [colorId, setColorId] = useState(String(metaData?.colorId ?? "1"));

    /**
  * Method handles the template selection updation
  */
    const handleApply = async () => {
        try {
            await PUT({
                url: `event/template/${metaData?.entityId}`,
                id: 'templateUpdate',
                body: { templateId: metaData.id, colorId },
                successCB: (context: any) => {
                    if (context?.success) {
                        onSubmitHandler && onSubmitHandler();
                        onCancel && onCancel();
                    }
                },
                errorCB: (context: any) => {
                    Logger.error('TemplateCustomizeCard.tsx', context?.message);
                }
            });
        } catch (error) {
            Logger.error('TemplateCustomizeCard.tsx', error);

        }
    }

    /**
     * Method handles the template color selection
     * @param id : color id
     */
    const handleSelectColor = (id: string) => {
        setColorId(id);
    }


    return (
        <Grid container size={{ xs: 12, sm: 12 }} className="event-detail-template-card-customize" spacing={2}>
            <Grid container size={{ xs: 12, sm: 12 }} justifyContent={'space-between'} className="event-detail-template-card-customize-title-container">
                <Grid>
                    <Typography className="event-detail-template-card-header" >
                        Customize Template
                    </Typography>
                </Grid>
                <Grid>
                    <CustomButton onClick={() => onCancel && onCancel()} label="Cancel" className="event-detail-template-card-customize-cancel-button" />
                    <CustomButton onClick={() => handleApply()} label="Apply Theme" className="event-detail-template-card-customize-apply-button" />
                </Grid>

            </Grid>
            <Grid container size={{ xs: 12, sm: 12 }}>
                <Grid size={{ xs: 12, sm: 3 }}>
                    <Grid><Typography className="event-detail-template-card-customize-sub-title">Choose Your Theme Color</Typography></Grid>
                    <Grid><Typography className="event-detail-template-card-customize-content">Personalize your experience by selecting a theme color that suits your style. Your choice will be applied accross the dashboard for a customized look.</Typography></Grid>
                    <Grid>
                        <Typography className="event-detail-template-card-customize-sub-title">Default Style</Typography>
                        <Grid className={`event-detail-template-card-customize-theme-default ${colorId === '1' ? "event-detail-template-card-customize-theme-selected-border" : ""} `} container justifyContent={'center'} alignItems={'center'} onClick={() => handleSelectColor("1")}>
                            <Grid className="event-detail-template-card-customize-theme-default-dark"></Grid>
                            <Grid className="event-detail-template-card-customize-theme-default-light"></Grid>
                        </Grid>
                        <Typography className="event-detail-template-card-customize-sub-title">Style Variations</Typography>
                        {themes.map(({ id, className }) => (
                            <Grid
                                key={id}
                                className={`event-detail-template-card-customize-theme-${className} ${colorId === id ? "event-detail-template-card-customize-theme-selected-border" : ""
                                    }`}
                                container
                                justifyContent="center"
                                alignItems="center"
                                onClick={() => handleSelectColor(id)}
                            >
                                <Grid className={`event-detail-template-card-customize-theme-${className}-dark`} />
                                <Grid className={`event-detail-template-card-customize-theme-${className}-light`} />
                            </Grid>
                        ))}
                    </Grid>

                </Grid>
                <Grid size={{ xs: 12, sm: 9 }}><TemplateContainer templateId={metaData?.id} eventId={metaData?.entityId} colorId={colorId} /></Grid>

            </Grid>
        </Grid>
    )


}


export default TemplateCustomizeCard;