import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import DeleteIcon from "@/assets/svg/delete-program-icon.svg";
import CustomAutocomplete from '@/components/CustomAutocomplete/CustomAutocomplete';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import apiClient from '@/Libs/Https/API-client';
import { processAPIResponse } from '@/Utils/CommonBaseClass';
import { Logger } from '@/Utils/Logger';
import CustomButton from '@/components/CustomButton/CustomButton';
import { CloseOutlined } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { POST, setDataById } from '@/Libs/store';
import CustomSelect from '@/components/CustomSelectBox/CustomSelect';

interface AssignedSponsorsProps {
    onClose: () => void;
    sponsorList: () => void;
}

interface Sponsor{
    value: number;
    label:string;
}
const AssignedSponsors = ({ onClose, sponsorList }: AssignedSponsorsProps) => {
    const { control, getValues } = useForm();
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    // const [source, setSource] = useState<ISource | undefined>(undefined);
    const [assignedSponsors, setAssignedSponsors] = useState<any[]>([]);
    const { id } = useParams()
    const companyId = sessionStorage.getItem('companyId')
    const [sponsorType,setSponsorType]=useState<Sponsor[]>([]);
    const userId = sessionStorage.getItem('userId');

    


    /**
     * Function to assign the volunteers which are selected, the selected volunteers are passing in an array
     */
    const handleSubmit = async () => {
        try {
            const sponsorIds = assignedSponsors?.map(sponsor => sponsor.user?.id);
            const sponsorTypeId = getValues("sponsorType"); // Get the selected sponsorType ID
                const req = {
                    sponsors: sponsorIds?.map((sponsorId) => ({
                        sponsorTypeId, 
                        parentEventId: id, 
                        sponsorId,
                        createdBy:userId, 
                      })),

                };
                const response = await apiClient.post(`sponsor/assign`, req);

                if (response.data.status === "success") {
                    setDataById("snackBarInfo", {
                        open: true,
                        autoHideDuration: 2000,
                        severity: "success",
                        message: "Sponsor successfully assigned",
                      });
                    onClose();
                    sponsorList();
                }
            } catch (error) {
                setDataById("snackBarInfo", {
                    open: true,
                    autoHideDuration: 2000,
                    severity: "error",
                    message: "sponsor already assigned",
                  });
                Logger.error("AssignedSponsor.tsx", error);
            }
    };
    /**
  * Searches sponsor based on the query entered by the user.
  * @param query - The search query entered by the sponsor
  */
    const handleSearch = async (query: string) => {
        setLoading(true);
        try {
            const filters: any = {
                companyId: companyId,
            };
    
           if (/^\d+$/.test(query)) {
                filters.phone = query; 
            } else {
                filters.name = query;
            }
    
            const req: any = { filters };
            const response = await await apiClient.post(
                `sponsor/list`,
                req
            );
            const { status, data } = await processAPIResponse(
                response,
                "sponsorList"
            );
            if (status) {
                setSearchResults(data);
            }
        } catch (error) {
            Logger.error("AssignedSponsor.tsx", error);
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
                setAssignedSponsors((prev: any) => {
                    const isAlreadyAssigned = prev.some(
                        (sponsor: any) => sponsor.user?.id === selected.id
                    );
                    if (!isAlreadyAssigned) {
                        const updatedSponsor = [...prev, { user: selected }];
                        return updatedSponsor;
                    } else {
                        setDataById("snackBarInfo", {
                            open: true,
                            autoHideDuration: 2000,
                            severity: "error",
                            message: "Sponsor already Selected",
                          });
                        return prev;
                    }
                });
            }
     
    };

    const handleDelete = (id: string) => {
        setAssignedSponsors((prev) => prev.filter((sponsor) => sponsor.user.id !== id));
    };
   
    const getSponsor=async ()=>{
          await POST({
              url:'sponsorType/list',
              body:{},
              id:'sponsorType-list',
              successCB: (_context: any) => {
                let _sponsor:any=[];
                _context.data.forEach((item: any) => {
                  _sponsor.push({
                    value: item?.id,
                    label: item?.name
                  })
                })
                setSponsorType(_sponsor)
              }, 
              errorCB: (context: any) => {
                  setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: context?.message });
              }
          });
      }

      useEffect(() => {
        getSponsor()
      }, [])

    return (
        <div className='assigned-volunteer-main-container'>
            <Box
                className="assigned-volunteer-container"
            >
                <Typography className='assigned-volunteer-main-label'>
                    Assign Sponsors
                </Typography>
                <IconButton onClick={onClose} >
                    <CloseOutlined />
                </IconButton> 
            </Box>
            <Grid container className='assigned-volunteer-search'>
           
                <Grid size={{ xs: 12, sm: 12 }} >
                <Typography fontSize={20} marginBottom={1}>
                    Sponsorship Type
                </Typography>
                    <CustomSelect
                    fullWidth
                    name="sponsorType"
                    control={control}
                    label="Sponsor Type"
                    options={sponsorType}
                    />
                  </Grid>
            </Grid>
            <Grid container className='assigned-volunteer-search'>
            <Grid size={{ xs: 12, sm: 12 }}>

            <Typography fontSize={20} marginBottom={1}>
                    Select the Sponsor
                </Typography>
                <CustomAutocomplete
                    name="search"
                    className="custom-user-search-field assigned-volunteer-search-field"
                    placeholder="Search by ID, Name or Phone ..."
                    control={control}
                    options={searchResults}
                    getOptionLabel={(option: any) => {
                        const name = option?.name || '';
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
            </Grid>

           {assignedSponsors.length>0 &&(<Typography gutterBottom className='assigned-volunteer-label'>
                Assigned Sponsors
            </Typography>)}

            <Grid container spacing={2} className='assigned-volunteer-container-style'>
                {assignedSponsors?.map((sponsor) =>  (
                    <Grid size={12} key={sponsor.id}>
                        <Card
                            variant="outlined"
                            className='assigned-volunteer-card'
                        >
                            <CardContent className='assigned-volunteer-container-card'>
                                <Typography variant="subtitle1" className='assigned-volunteer-name'>
                                    {`${sponsor?.user?.name}`}
                                </Typography>
                                <Typography variant="body2" className='assigned-volunteer-phone'>{sponsor?.user?.phone}</Typography>
                            </CardContent>
                            <IconButton
                                onClick={() => handleDelete(sponsor?.user?.id)}
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
                    onClick={handleSubmit}
                    disabled={assignedSponsors.length === 0 ? true:false}
                />
            </div>
          <Typography className="cursor-container-link" display={'flex'} justifyContent={'flex-end'} paddingTop={2} variant="h6">Create New Sponsor ?</Typography>
            
        </div>

    );
};

export default AssignedSponsors;
