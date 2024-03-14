import {fireEvent, render, screen } from '@testing-library/react';
import FeedbackForm from './components/FeedbackForm';

describe('Feedback Form',()=>{
  test("Submission is disabled if score is lower than 5 and there is no feedback", () => {
    const handleSubmit=jest.fn()
    render(<FeedbackForm onSubmit={handleSubmit}/>);

    const rangeInput=screen.getByLabelText(/Score:/) //需用正則 否則會尋找僅包含Score:的內容
    fireEvent.change(rangeInput,{target:{value:"4"}})

    const submitButton=screen.getByRole("button")
    fireEvent.click(submitButton)

    expect(handleSubmit).not.toHaveBeenCalled()
    expect(submitButton).toHaveAttribute("disabled")
        
  });
  test("User is able to submit the form if the score is lower than 5 and additional feedback is provided",()=>{
    //將commentInput設置為textarea score<5並隨機輸入長度大於10的內容 預期輸出為 可submit且submitButton沒有disabled屬性
    const handleSubmit=jest.fn()
    render(<FeedbackForm onSubmit={handleSubmit}/>);

    const rangeInput=screen.getByLabelText(/Score:/)
    const score="4"
    const commentInput=screen.getByLabelText(/Comments:/)
    const submitButton=screen.getByRole("button")

    fireEvent.change(rangeInput,{target:{value: score}})
    fireEvent.change(commentInput,{target:{value:"bad meal......"}})
    fireEvent.click(submitButton)
    expect(handleSubmit).toHaveBeenCalled()
    expect(submitButton).not.toHaveAttribute("disabled")
    });
  
  test("User is able to submit the form if the score is higher than 5, without additional feedback",()=>{
    //將commentInput設置為textarea score>=5 不須輸入內容 預期輸出為 可submit且submitButton沒有disabled屬性
    const handleSubmit=jest.fn()
    render(<FeedbackForm onSubmit={handleSubmit}/>);
    const rangeInput=screen.getByLabelText(/Score:/)
    const commentInput=screen.getByLabelText(/Comments:/)
    const submitButton=screen.getByRole("button")

    fireEvent.change(rangeInput,{target:{value:"5"}})
    fireEvent.change(commentInput,{target:{value:""}})
    fireEvent.click(submitButton)
    expect(handleSubmit).toHaveBeenCalled()
    expect(submitButton).not.toHaveAttribute("disabled")
  })  
    


})

