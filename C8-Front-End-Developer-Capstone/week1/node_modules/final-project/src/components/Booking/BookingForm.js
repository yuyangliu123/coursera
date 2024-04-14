import { useForm } from "react-hook-form";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from "react";

// 定義驗證模式
const schema = Yup.object().shape({
  fName: Yup.string().required('First name is required'),
  lName: Yup.string().required('Last name is required'),
  email: Yup.string().email("Invalid email").required("Email is required"),
  resDate: Yup.date().required('Reservation date is required'),
  resTime: Yup.string().required('Reservation time is required'),
  guests: Yup.number().min(1, 'Must be at least 1 guest').max(10, 'Cannot exceed 10 guests').required('Number of guests is required'),
  occasion: Yup.string().required('Occasion is required'),
});

const BookingForm = () => {
    const { register, handleSubmit, watch, formState: { errors }, trigger, setValue } = useForm({
      resolver: yupResolver(schema),
      mode: 'onBlur' // 預設使用onBlur驗證
    });
  
    // 監聽email字段的變化，並使用onChange事件觸發驗證
    const email = watch('email');
    useEffect(() => {
      trigger('email');
    }, [email, trigger]);
  
    // 表單提交的處理函數
    const onSubmit = data => {
      console.log(data);
    };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}  style={{ display: "grid", maxWidth: "200px", gap: "20px" }}>
        <label htmlFor="fname">First Name</label>
        <input type="name" id="fname" {...register("fName",{required: true})}/>
        {errors.fName && <span>This field is required</span>}
        <label htmlFor="lname">Last Name</label>
        <input type="name" id="lname" {...register("lName",{required: true})}/>

        
        <label htmlFor="res-date">Choose date</label>
        <input type="date" id="res-date" {...register("resDate", { required: true })} />
        {errors.resDate?.message}

        <label htmlFor="res-time">Choose time</label>
        <select id="res-time" {...register("resTime", { required: true })}>
          <option value="17:00">17:00</option>
          <option value="18:00">18:00</option>
          <option value="19:00">19:00</option>
          <option value="20:00">20:00</option>
          <option value="21:00">21:00</option>
          <option value="22:00">22:00</option>
        </select>
        {errors.resTime && <span>This field is required</span>}

        <label htmlFor="guests">Number of guests</label>
        <input type="number" placeholder="1" min="1" max="10" id="guests" {...register("guests", { required: true, min: 1, max: 10 })} />
        {errors.guests && <span>This field is required and must be between 1 and 10</span>}

        <label htmlFor="occasion">Occasion</label>
        <select id="occasion" {...register("occasion", { required: true })}>
          <option value="Birthday">Birthday</option>
          <option value="Anniversary">Anniversary</option>
        </select>
        {errors.occasion && <span>This field is required</span>}

        <input type="submit" value="Make Your reservation" />
      </form>
    </>
  );
};

export default BookingForm;
