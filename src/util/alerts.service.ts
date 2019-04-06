import swal from "sweetalert";

const showAlert = (options: any)=>{
    return swal(options);
}
const stopSwalLoading = ()=>{
    return swal.stopLoading();
}
const closeSwal = ()=>{
    return swal.close();
}

export  { showAlert , stopSwalLoading, closeSwal };