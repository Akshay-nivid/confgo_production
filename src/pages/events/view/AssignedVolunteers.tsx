import { Grid, Card, CardContent, Typography, IconButton, Button, Box } from '@mui/material';
import DeleteIcon from "@/assets/svg/delete-program-icon.svg";
import CustomAutocomplete from '@/components/CustomAutocomplete/CustomAutocomplete';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import apiClient from '@/Libs/Https/API-client';
import { processAPIResponse } from '@/Utils/CommonBaseClass';
import { Logger } from '@/Utils/Logger';
import { ISource } from '@/Libs/type';
import CustomButton from '@/components/CustomButton/CustomButton';
import { CloseOutlined } from '@mui/icons-material';

interface AssignedVolunteersProps {
    onClose: () => void;
}
const AssignedVolunteers = ({ onClose }: AssignedVolunteersProps) => {
    const { control } = useForm();
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false); // To indicate loading state for API
    const [source, setSource] = useState<ISource | undefined>(undefined);
    const volunteers = [
        { id: 1, name: 'Kathy Pacheco', phone: '(215) 424-7763' },
        { id: 2, name: 'Corina McCoy', phone: '(215) 424-7763' },
        { id: 3, name: 'Mary Freund', phone: '(215) 424-7763' },
        { id: 4, name: 'Frances Swann', phone: '(215) 424-7763' },
    ];

    const handleDelete = (id: number) => {
        console.log(`Delete volunteer with ID: ${id}`);
    };

    const handleSubmit = () => {
        console.log('Submit assigned volunteers');
    };

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
            setSource({
                method: "POST",
                data: {
                    offset: 0,
                    limit: 5,
                    filters: {
                        id: selected.id,
                    },
                },
                url: `participant/list`,
                listName: "participant-list-",
            });
        }
    };

    return (
        <div style={{ padding: 16, maxWidth: 500, margin: '0 auto', marginTop: 35 }}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                marginBottom={2} // Adds spacing below the header
            >
                <Typography variant="h4">
                    Assign Volunteers
                </Typography>
                <IconButton>
                    <CloseOutlined onClick={onClose} />
                </IconButton>
            </Box>

            <Grid container style={{ marginTop: 30, width: '100%' }}>
                <CustomAutocomplete
                    name="search"
                    className="custom-user-search-field"
                    placeholder="Search by ID, Name or Phone ..."
                    control={control}
                    options={searchResults}
                    getOptionLabel={(option: any) => option.user?.firstName || ""}
                    onSearch={handleSearch}
                    loading={loading}
                    onChange={handleAutocompleteChange}
                    style={{
                        width: '100%',
                        maxWidth: '600px',
                    }}
                />
            </Grid>
            <Typography variant="h6" gutterBottom style={{ marginTop: 50 }}>
                Assigned Volunteers
            </Typography>

            <Grid container spacing={2} style={{ marginTop: 10 }}>
                {volunteers.map((volunteer) => (
                    <Grid item xs={12} key={volunteer.id}>
                        <Card
                            variant="outlined"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: 16,
                            }}
                        >
                            <CardContent style={{ flex: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {volunteer.name}
                                </Typography>
                                <Typography variant="body2">{volunteer.phone}</Typography>
                            </CardContent>
                            <IconButton
                                onClick={() => handleDelete(volunteer.id)}
                                style={{
                                    border: '2px solid #FF0000', // Red border
                                    borderRadius: '5px', // Slightly rounded corners
                                    padding: '5px', // Space around the icon
                                    width: '30px', // Adjust width for consistency
                                    height: '30px', // Adjust height for consistency
                                    display: 'flex', // Center the icon
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <div style={{ textAlign: 'right', marginTop: 14 }}>
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
