import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// 定義驗證規則
const schema = yup.object().shape({
  fname:yup.string().required("First Name is required"),
  email: yup.string().email('請輸入有效的電子郵件地址').required('電子郵件是必填項'),
  password: yup.string().min(4, '密碼至少4位').required('密碼是必填項'),
  numberOfPeople: yup.number().typeError('人數必須是數字').min(1, '至少一人').max(20,"最多20人").required('人數是必填項'),
  resTime: yup.string().required('Reservation time is required'),
  resDate: yup.date().typeError('請輸入有效日期').required('日期是必填項'),
  occasion: yup.string().oneOf(['Birthday', 'Anniversary'], '必須是 Birthday 或 Anniversary').required('場合是必填項'),
});

const BookingForm = () => {
  const { register, handleSubmit, watch, formState: { errors, isValid }, reset } = useForm({
    mode: 'onChange', // 即時驗證
    resolver: yupResolver(schema)
  });

  // 監控表單值的變化
  const fname = watch('fname');
  const email = watch('email');
  const password = watch('password');
  const numberOfPeople = watch('numberOfPeople');
  const resTime = watch('resTime');
  const resDate = watch('resDate');
  const occasion = watch('occasion');

  const onSubmit = async(e) => {
    try {
      let result = await fetch(
        "http://localhost:5000/register",{
          method: "post",
          body:JSON.stringify({fname,email,password,numberOfPeople,resTime,resDate,occasion}),
          headers:{
            "Content-Type":"application/json"
          }
        }
      );
      result = await result.json();
      console.warn(result);
      if(result){
        console.log(result);
        alert("Data save succesfully");
        reset(); // 重置表單
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>First Name</label>
        <input name="fname" {...register('fname')} />
        {errors.fname && <p>{errors.fname.message}</p>}
      </div>

      <div>
        <label>電子郵件</label>
        <input name="email" {...register('email')} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <div>
        <label>密碼</label>
        <input type="password" name="password" {...register('password')} />
        {errors.password && <p>{errors.password.message}</p>}
      </div>

      <div>
        <label>人數</label>
        <input type="number" name="numberOfPeople" {...register('numberOfPeople')} />
        {errors.numberOfPeople && <p>{errors.numberOfPeople.message}</p>}
      </div>

      <div>
        <label>日期</label>
        <input type="date" name="resDate" {...register('resDate')} />
        {errors.resDate && <p>{errors.resDate.message}</p>}
      </div>
      
      <div>
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
      </div>
      
      <div>
        <label htmlFor="occasion">Occasion</label>
          <select id="occasion" {...register("occasion", { required: true })}>
            <option value="Birthday">Birthday</option>
            <option value="Anniversary">Anniversary</option>
          </select>
          {errors.occasion && <span>This field is required</span>}
      </div>

      <button type="submit" disabled={!isValid}>提交訂單</button>
    </form>
  );
}

export default BookingForm