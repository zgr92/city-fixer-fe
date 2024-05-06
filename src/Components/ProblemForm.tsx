import { ReactElement, useReducer, useState, } from 'react';
import { useAppDispatch } from './../hooks';
import Problem from "../Types/ProblemInterface";
import { unwrapResult } from '@reduxjs/toolkit';
import { saveProblem } from './../problemsSlice';
import React from 'react';

export default function ProblemForm(): ReactElement {
    const dispatch = useAppDispatch();
    const [addRequestStatus, setAddRequestStatus] = useState('idle');
    const formReducer = (state: Problem, event: { name?: string, value?: string | number, reset?: boolean }) => {
      if (event.reset) {
        return {
          longtitude: '',
          latitude: '',
          locationDesc: '',
          problemDesc: '',
          proposedFix: '',
        };
      }
  
      if (event.name && event.value) {
        return {
          ...state,
          [event.name]: event.value,
        };
      }
  
      return {...state};
    };
  
    const [formData, setFormData] = useReducer(
      formReducer,
      {
        longtitude: '',
        latitude: '',
        locationDesc: '',
        problemDesc: '',
        proposedFix: '',
      },
    );
  
    const handleProblemSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setFormData({
        reset: true,
      });
  
      try {
        setAddRequestStatus('pending');
        const resultAction = await dispatch(saveProblem(formData));
        unwrapResult(resultAction);
      } catch (err) {
        console.error('Failed to save the post: ', err);
      } finally {
        setAddRequestStatus('idle');
      }
    };
  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
      setFormData({
        name: event.target.name,
        value: event.target.value,
      });
    };
  
    return (
      <div className="problem-form-container">
        <h1>Zgłoś problem w mieście</h1>
        <form onSubmit={handleProblemSubmit}>
          <label>
            Długość geograficzna
            <input type="text" name="longtitude" onChange={handleChange} value={formData.longtitude || ''} />
          </label>
          <label>
            Szerokość geograficzna
            <input type="text" name="latitude" onChange={handleChange} value={formData.latitude || ''} />
          </label>
          <label>
            Opis lokalizacji
            <textarea name="locationDesc" onChange={handleChange} value={formData.locationDesc || ''} />
          </label>
          <label>
            Opis problemu
            <textarea name="problemDesc" onChange={handleChange} value={formData.problemDesc || ''} />
          </label>
          <label>
            Proponowane rozwiązane
            <textarea name="proposedFix" onChange={handleChange} value={formData.proposedFix || ''} />
          </label>
          {addRequestStatus === 'idle'
            && <input type="submit" value="Wyślij" />}
        </form>
        {addRequestStatus === 'pending'
          && <div>Wysyłanie...</div>}
      </div>
    );
  }  