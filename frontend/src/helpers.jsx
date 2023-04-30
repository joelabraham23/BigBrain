import React from 'react';
import { useNavigate } from 'react-router-dom';

// Redirect a user to the Signin page if they do not have a token
export const RedirectToAuth = (page) => {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate(`/${page}`);
    } else {
      navigate('/signIn');
    }
  }, []);
  return <div>navigating</div>
}

// Redirect a user to the dashboard if they have a token
export const RedirectToDash = (page) => {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    } else {
      navigate(`/${page}`);
    }
  }, []);
}

// Function that makes an apicall to the backend server
export const apiCall = (path, method, body, showAlert = true) => {
  return new Promise((resolve, reject) => {
    let url = 'http://localhost:5011/' + path;
    const options = {
      method,
      headers: {
        'Content-type': 'application/json',
      },
    };
    if (method === 'GET') {
      const queryString = Object.entries(body)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

      // Construct the full URL with the encoded query string
      url = `${url}?${queryString}`;
    } else {
      options.body = body;
    }
    if (localStorage.getItem('token')) {
      options.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }

    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        if (data.error && showAlert) {
          alert(data.error);
          reject(data.error);
        } else {
          resolve(data);
        }
      });
  });
};

// Converts an image to a byte64 string
export function fileToDataUrl (file) {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const valid = validFileTypes.find(type => type === file.type);
  // Bad data, let's walk away.
  if (!valid) {
    console.log(file)
    alert('provided file is not a png, jpg or jpeg image.')
  }

  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}
