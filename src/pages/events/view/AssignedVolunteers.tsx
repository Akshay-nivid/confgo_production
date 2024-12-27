import { Grid, Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import DeleteIcon from "@/assets/svg/delete-program-icon.svg";
import CustomAutocomplete from '@/components/CustomAutocomplete/CustomAutocomplete';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import apiClient from '@/Libs/Https/API-client';
import { processAPIResponse } from '@/Utils/CommonBaseClass';
import { Logger } from '@/Utils/Logger';
// import { ISource } from '@/Libs/type';
import CustomButton from '@/components/CustomButton/CustomButton';
import { CloseOutlined } from '@mui/icons-material';

interface AssignedVolunteersProps {
    onClose: () => void;
    data: any[];
}
const AssignedVolunteers = ({ onClose, data }: AssignedVolunteersProps) => {
    const { control } = useForm();
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    // const [source, setSource] = useState<ISource | undefined>(undefined);
    const volunteers: any[] = data;

    const handleDelete = (_id: number) => {

    };

    // const handleSubmit = () => {

    // };

    /**
  * Searches participants based on the query entered by the user.
  * @param query - The search query entered by the user
  */
    const handleSearch = async (query: string) => {
        setLoading(true);
        try {
            let req = {
                filters: {
                    name: query,
                },
            };
            const response = await await apiClient.post(
                `participant/list`,
                req
            );
            const { status, data } = await processAPIResponse(
                response,
                "eventPartcipantList"
            );
            if (status) {
                setSearchResults(data);
            }
        } catch (error) {
            Logger.error("UserListCard.tsx", error);
        } finally {
            setLoading(false);
        }
    };

    /**
 * Updates the source for the data grid when an autocomplete selection is made.
 * @param selected - The selected item from the autocomplete list
 */
    const handleAutocompleteChange = (selected: any) => {
        if (selected) {
            // setSource({
            //     method: "POST",
            //     data: {
            //         offset: 0,
            //         limit: 5,
            //         filters: {
            //             id: selected.id,
            //         },
            //     },
            //     url: `participant/list`,
            //     listName: "participant-list-",
            // });
        }
    };
   
    return (
        <div className='assigned-volunteer-main-container'>
            <Box
                className="assigned-volunteer-container"
            >
                <Typography className='assigned-volunteer-main-label'>
                    Assign Volunteers
                </Typography>
                <IconButton>
                    <CloseOutlined onClick={onClose} />
                </IconButton>
            </Box>

            <Grid container className='assigned-volunteer-search'>
                <CustomAutocomplete
                    name="search"
                    className="custom-user-search-field assigned-volunteer-search-field"
                    placeholder="Search by ID, Name or Phone ..."
                    control={control}
                    options={searchResults}
                    getOptionLabel={(option: any) => option.user?.firstName || ""}
                    onSearch={handleSearch}
                    loading={loading}
                    onChange={handleAutocompleteChange}
                />
            </Grid>
            <Typography gutterBottom className='assigned-volunteer-label'>
                Assigned Volunteers
            </Typography>

            <Grid container spacing={2} className='assigned-volunteer-container-style'>
                {volunteers?.map((volunteer) => (
                    <Grid item xs={12} key={volunteer.id}>
                        <Card
                            variant="outlined"
                            className='assigned-volunteer-card'
                        >
                            <CardContent className='assigned-volunteer-container-card'>
                                <Typography variant="subtitle1" className='assigned-volunteer-name'>
                                    {volunteer.participant.user.firstName}
                                </Typography>
                                <Typography variant="body2" className='assigned-volunteer-phone'>{volunteer.participant.user.phone}</Typography>
                            </CardContent>
                            <IconButton
                                onClick={() => handleDelete(volunteer.id)}
                                className='assigned-volunteer-delete-icon'
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <div className='assigned-volunteer-button-container'>
                <CustomButton
                    className="assigned-volunteer-button"
                    label="Submit"
                    variant="contained"
                    size="medium"
                    type="submit"
                />
            </div>
        </div>

    );
};

export default AssignedVolunteers;
