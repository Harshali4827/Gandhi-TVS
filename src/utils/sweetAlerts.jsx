import Swal from 'sweetalert2';

export const confirmDelete = () => {
  return Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#243c7c',
    cancelButtonColor: '#dc4226',
    confirmButtonText: 'Yes, delete it!',
  });
};

export const showSuccess = (message = 'Deleted successfully') => {
  return Swal.fire({
    title: 'Success!',
    text: message,
    icon: 'success',
    confirmButtonColor: '#006cb5',
  });
};

export const showError = (message = 'Something went wrong') => {
  if (process.env.NODE_ENV === 'development') {
    console.error('SweetAlert Error:', message);
  }
  return Swal.fire({
    title: 'Error!',
    text: message,
    icon: 'error',
    confirmButtonColor: '#006cb5',
  });
};

export const showToast = (message, type = 'success') => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  return Toast.fire({
    icon: type,
    title: message,
  });
};



// Form Submission Success
export const showFormSubmitSuccess = (message = 'Data Saved Successfully!', navigateTo = null) => {
    return Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      confirmButtonColor: '#006cb5',
    }).then((result) => {
      if (result.isConfirmed && navigateTo) {
        navigateTo();
      }
    });
  };
  
  // Form Submission Error
  export const showFormSubmitError = (error) => {
    if (error.response && error.response.status === 400) {
      return Swal.fire({
        title: 'Error!',
        text: error.response.data.message,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } else {
      return Swal.fire({
        title: 'Error!',
        text: 'Something went wrong. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };
  

  export const showFormSubmitToast = (message = 'Data Saved Successfully!', navigateTo = null) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
  
    return Toast.fire({
      icon: 'success',
      title: message,
    }).then(() => {
      if (navigateTo) {
        navigateTo();
      }
    });
  };
  