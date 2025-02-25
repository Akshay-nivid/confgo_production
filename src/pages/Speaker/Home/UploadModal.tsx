import FileUpload from '@/components/FileUpload/FileUpload'
import useStore, { POST, PUT, setDataById } from '@/Libs/store'
import { Logger } from '@/Utils/Logger';
import { Box } from '@mui/material'
import Modal from '@mui/material/Modal'
import { useCallback } from 'react';



interface CustomFile {
    id: string;
    name: string;
}

/**
 * 
 * @returns Component for  Speaker file upload modal
 */

export default function UploadModal() {



    const handleModal = useStore((state) => state?.compData?.['speakerStore']?.uploadModal) ?? false;

    const speakerUserId = useStore((state) => state?.compData?.['userDetails']?.id) ?? [];

    const speakerBio = useStore((state) => state?.compData?.['speakerBio']) ?? [];

    /**
     *  Handle drawer Close
     */
     /**
     *  Handle modal Close
     */
     const modalClose = useCallback(() => {
        setDataById("speakerStore", {
            uploadModal: !handleModal
        });
    }, [handleModal]);

    /** 
    *image upload function for profile image
    */
    const handleFileUpload = useCallback(async (file: CustomFile) => {

        try {
            modalClose();
            PUT({
                url: `eventSpeaker/speaker-bio/${speakerBio?.item?.speakerBios?.[0]?.id}`,
                id: "savedpdf",

                body: {
                    fileId: file?.id,
                },

                successCB: (_context) => {

                    POST({

                        url: `eventSpeaker/list`,
                        id: "speakerDataList",
                        body: {

                            filters: {
                                userId: speakerUserId,
                                parentEventId: speakerBio?.item?.parentEventId
                            }
                        },

                        errorCB: (error: any) => {
                            Logger.error("error in  eventSpeaker/list", error?.message)
                        }
                    })
                    setDataById("snackBarInfo", {

                        open: true,
                        autoHideDuration: 2000,
                        severity: "success",
                        message: "Abstract Added Successfully",

                    });
                }
            });

        } catch (error) {
            Logger.error("Error in Speaker upload file", error);
        }
    }, [modalClose, speakerUserId, speakerBio]);


    return (
        <Modal open={handleModal} onClose={modalClose}>

            <Box className="modal-upload-container">


                <FileUpload
                    isAbstract={true}
                    acceptedFiles={['application/pdf']}
                    trimClientSide={false}
                    resolution={{ width: 200 }}
                    onSubmit={(file) =>
                        handleFileUpload(file)
                    }
                    height={'25rem'}
                    maxSize={10}
                />

            </Box>

        </Modal>
    )
}
