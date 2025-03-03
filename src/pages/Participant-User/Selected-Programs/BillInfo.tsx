import useStore from '@/Libs/store'
import { Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'



const BillInfo = () => {



    const cartInfo = useStore((state) => state?.compData?.addToCart)

    const cartId = cartInfo?.cart.data?.id ?? null

    const cartData = useStore((state) => state.compData?.getCart?.[`cart/${cartId}`]) ?? null

    const couponData = useStore((state) => state?.compData?.couponData?.['coupon/applyCoupon']) ?? null
    
    const finalPrice = useStore((state) => state?.compData?.["finalPrice"]?.value) ?? null


    return (
        <Grid container flexDirection={"column"} className="bill-details-container shadow">

            <Grid container flexDirection={"row"} className="mb_2" justifyContent={"space-between"}>
                <Typography className="sub-text">Event amount</Typography>
                <Typography className="sub-text">$ {Number(cartData?.data?.eventAmount).toFixed(2)}</Typography>
            </Grid>


            <Grid container flexDirection={"row"} className="mb_2" justifyContent={"space-between"}>
                <Typography className="sub-text">Program amount</Typography>
                <Typography className="sub-text">$ {Number(cartData?.data?.programTotal).toFixed(2)}</Typography>
            </Grid>

            <Grid container flexDirection={"row"} className="mb_2" justifyContent={"space-between"}>
                <Typography className="sub-text">Addon amount</Typography>
                <Typography className="sub-text">$ {Number(cartData?.data?.addonTotal).toFixed(2)}</Typography>
            </Grid>

            {cartData?.data?.priceTierDiscount && <Grid container flexDirection={"row"} className="mb_2" justifyContent={"space-between"}>
                <Typography className="sub-text">Tier Discount</Typography>
                <Typography className="sub-text">$ {Number(cartData?.data?.priceTierDiscount).toFixed(2)}</Typography>
            </Grid>}

            {couponData?.data?.coupon?.code && <Grid className="mb_2" container flexDirection={"row"} justifyContent={"space-between"}>
                <Typography className="sub-text">Coupon Applied</Typography>
                <Typography className="sub-text discount"> - $ {Number(couponData.data?.discountAmount).toFixed(2)}</Typography>
            </Grid>}

            <Grid className="divider mb_2" ></Grid>

            <Grid container flexDirection={"row"} justifyContent={"space-between"}>
                <Typography className="total-text">Grand Total</Typography>
                <Typography className="total-text">$ {Number(finalPrice).toFixed(2)}</Typography>
            </Grid>

        </Grid>
    )
}

export default BillInfo
