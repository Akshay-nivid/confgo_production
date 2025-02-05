import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import DeleteIcon from "@/assets/svg/delete-program-icon.svg";
import CustomAutocomplete from '@/components/CustomAutocomplete/CustomAutocomplete';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import apiClient from '@/Libs/Https/API-client';
import { processAPIResponse } from '@/Utils/CommonBaseClass';
import { Logger } from '@/Utils/Logger';
import CustomButton from '@/components/CustomButton/CustomButton';
import { CloseOutlined } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { setDataById, setNonPersistedDataById } from '@/Libs/store';
import routes from '@/router/routes';

interface AssignedVolunteersProps {
    onClose: () => void;
    volunteerList: () => void;
    data:any;
}
const AssignedVolunteers = ({ onClose, volunteerList ,data}: AssignedVolunteersProps) => {
    const { control } = useForm();
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    // const [source, setSource] = useState<ISource | undefined>(undefined);
    const [assignedVolunteers, setAssignedVolunteers] = useState<any[]>([]);
    const { id } = useParams()
    const companyId = sessionStorage.getItem('companyId')
     const navigate = useNavigate();
    /**
     * Function to assign the volunteers which are selected, the selected volunteers are passing in an array
     */
    const handleSubmit = async () => {
        try {
            const userIds = assignedVolunteers?.map(volunteer => volunteer.user?.id);
                const req = {
                        userIds: userIds,
                        eventId: id,
                        companyId: companyId,
                };
                const response = await apiClient.post(`user/assignEvent`, req);

                if (response.data.status === "success") {
                    setDataById("snackBarInfo", {
                        open: true,
                        autoHideDuration: 2000,
                        severity: "success",
                        message: "Volunteer successfully assigned",
                      });
                    onClose();
                    volunteerList();
                }
            } catch (error) {
                setDataById("snackBarInfo", {
                    open: true,
                    autoHideDuration: 2000,
                    severity: "error",
                    message: "volunteer already assigned",
                  });
                Logger.error("AssignedVolunteers.tsx", error);
            }
    };
    /**
  * Searches participants based on the query entered by the user.
  * @param query - The search query entered by the user
  */
    const handleSearch = async (query: string) => {
        setLoading(true);
        try {
            const filters: any = {
                roleEnums: ["VOLUNTEER"],
                companyId: companyId,
            };
    
           if (/^\d+$/.test(query)) {
                filters.phone = query; 
            } else {
                filters.name = query;
            }
    
            const req: any = { filters };
            const response = await await apiClient.post(
                `user/userRole/list`,
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
    const handleAutocompleteChange = async (selected: any) => {
            if (selected?.id) {
                setAssignedVolunteers((prev: any) => {
                    const isAlreadyAssigned = prev.some(
                        (volunteer: any) => volunteer.user?.id === selected.id
                    );
                    if (!isAlreadyAssigned) {
                        const updatedVolunteers = [...prev, { user: selected }];
                        return updatedVolunteers;
                    } else {
                        setDataById("snackBarInfo", {
                            open: true,
                            autoHideDuration: 2000,
                            severity: "error",
                            message: "volunteer already Selected",
                          });
                        return prev;
                    }
                });
            }
     
    };

    const handleDelete = (id: string) => {
        setAssignedVolunteers((prev) => prev.filter((volunteer) => volunteer.user.id !== id));
    };

    /**
    * drawer create speaker button
    */
    const createNewVolunteer = (volunteer: any) => {

        setNonPersistedDataById('craeteUserDrawer', { value: true });

        navigate(routes.users(), { state: { data: volunteer, eventId: data?.eventData?.id } });

    };
  
   
    return (
        <div className='assigned-volunteer-main-container'>
            <Box
                className="assigned-volunteer-container"
            >
                <Typography className='assigned-volunteer-main-label'>
                    Assign Volunteers
                </Typography>
                <IconButton onClick={onClose} >
                    <CloseOutlined />
                </IconButton> 
            </Box>

            <Grid container className='assigned-volunteer-search'>
                <CustomAutocomplete
                    name="search"
                    className="custom-user-search-field assigned-volunteer-search-field"
                    placeholder="Search by ID, Name or Phone ..."
                    control={control}
                    options={searchResults}
                    getOptionLabel={(option: any) => {
                        const name = option?.firstName || '';
                        const email = option?.email || '';
                        const phone = option?.phone || '';
                        if (!name && !email && !phone) {
                            return '';
                        }
                        return `${name} ${email ? `(${email})` : ''}, ${phone ? phone : ''}`;
                    }}                   
                    onSearch={handleSearch}
                    loading={loading}
                    onChange={handleAutocompleteChange}
                />
            </Grid>

           {assignedVolunteers.length>0 &&(<Typography gutterBottom className='assigned-volunteer-label'>
                Assigned Volunteers
            </Typography>)}

            <Grid container spacing={2} className='assigned-volunteer-container-style'>
                {assignedVolunteers?.map((volunteer) =>  (
                    <Grid size={12} key={volunteer.id}>
                        <Card
                            variant="outlined"
                            className='assigned-volunteer-card'
                        >
                            <CardContent className='assigned-volunteer-container-card'>
                                <Typography variant="subtitle1" className='assigned-volunteer-name'>
                                    {`${volunteer?.user?.firstName} ${volunteer?.user?.lastName}`}
                                </Typography>
                                <Typography variant="body2" className='assigned-volunteer-phone'>{volunteer?.user?.phone}</Typography>
                            </CardContent>
                            <IconButton
                                onClick={() => handleDelete(volunteer?.user?.id)}
                                className='assigned-volunteer-delete-icon'
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            
            <Grid container spacing={2} bgcolor={"red"}>
          
        </Grid>

            <Grid className='assigned-volunteer-button-container' size={12} container justifyContent={"flex-end"} spacing={0}> 
            
          <Grid size={12}>

          <CustomButton
                    className="assigned-volunteer-button"
                    label="Submit"
                    variant="contained"
                    size="medium"
                    type="submit"
                    onClick={handleSubmit}
                    disabled={assignedVolunteers.length === 0 ? true:false}
                />
          </Grid>

                <Grid >

                <CustomButton
                
                variant='outlined'
                className="assigned-volunteer-button-create"
                label="Create Volunteer"
                onClick={()=>createNewVolunteer("VOLUNTEER")}
                size="medium"

                />    
                </Grid>
            </Grid>
        </div>

    );
};

export default AssignedVolunteers;
