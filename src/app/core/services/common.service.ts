import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Const } from '../static/const';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class CommonService {


  constructor(private datePipe: DatePipe) { }

  // -- Table Numbers
  getComputedRowNumber(globalIndex: number, index: number): number {
    return globalIndex + index + 1;
  }

  // -- Pagination
  calculateActivePages(currentPage: number, totalPages: number): number[] {
    const visiblePages = 5;
    const activePages: number[] = [];

    const startPage = Math.max(
      1,
      currentPage - Math.floor(visiblePages / 2)
    );
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    for (let page = startPage; page <= endPage; page++) {
      activePages.push(page);
    }

    return activePages;
  }

  // -- Document manipulations
  scrollToElement(element: any): void {
    element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  goToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  // -- File Handler
  renameFile(file: File, fileId: any): File {
    const fileExt = file.name.split(".").pop();
    const newFileName = `${fileId}.` + fileExt;
    const renamedFile = new File([file], newFileName, { type: file.type });
    return renamedFile;
  }

  // -- Date
  getLastDayOfMonth(year: number, month: number) {
    month -= 1
    return new Date(year, month + 1, 0).getDate();
  }

  getTodayDate() {
    const today = new Date();
    const year = today.getFullYear().toString().padStart(4, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getDate(timestamp: any): string | null {
    if (timestamp) {
      let date = new Date(timestamp).toLocaleDateString()
      return date
    }
    return null
  }

  getLocaleDate(date: string | number | Date): string {
    const dateObj = new Date(date);
    const month = dateObj.toLocaleString('default', { month: 'short' });
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    return `${day} ${month}, ${year}`;
  }

  getTime(date: string): string {
    const dateObj = new Date(date);
    const time = dateObj.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return time;
}

  getMonthName(month: number): string {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    return monthNames[month - 1];
  }

  formatDate(date: Date, format?: string): string | null {
    return this.datePipe.transform(date, format ? format : 'dd-MM-yyyy');
  }

  isTodayTask(today: string, startDate: Date | string | number, endDate?: Date | string | number | null): boolean {
    if (endDate) {
      const end = new Date(endDate)
      return this.isDateInRange(today, startDate, end)
    } else {
      const date = new Date(startDate)
      startDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  
      return today == startDate ? true : false
    }
  }

  private isDateInRange(date: string | number | Date, start: string | number | Date, end: string | number | Date): boolean {
    const targetDate = new Date(date)
    const startDate = new Date(start)
    const endDate = new Date(end)
    return targetDate >= startDate && targetDate <= endDate;
  }

  getThreeDays(date: string): Date {
    const currentDate = new Date(date)
    return new Date(currentDate.setDate(currentDate.getDate() + 3))
  }

  getDateMinusOneSecond(date: Date | null): Date | null {
    const dateBefore = date ? new Date(date) : null
    dateBefore?.setSeconds(dateBefore.getSeconds() - 1)
    return dateBefore
  }

  // -- HTML class manipulations
  getPercentageBadge(percentage: number): string {
    switch (true) {
      case percentage < 35:
        return 'danger';
      case percentage < 70:
        return 'warning';
      case percentage < 100:
        return 'success';
      case percentage === 100:
        return 'secondary';
      default:
        return 'primary';
    }
  }

  getCategoryBadge(category: any): string {
    switch (true) {
      case category == 'Cleaning':
        return 'primary';
      case category == 'Inspecting':
        return 'secondary';
      case category == 'Lubricating':
        return 'info';
      case category == 'Tightening':
        return 'success';
      default :
        return 'dark';
    }
  }

  getTaskAreaColor(areaId: number, areaData: number[], isTodayTask: boolean = false): string {
    let transparency = isTodayTask ? '1' : '0.75'
    let color = [
      `rgba(75, 56, 179, ${transparency})`, `rgba(53, 119, 241, ${transparency})`, 
      `rgba(69, 203, 133, ${transparency})`, `rgba(41, 156, 219, ${transparency})`, `rgba(255, 190, 11, ${transparency})`, 
      `rgba(240, 101, 72, ${transparency})`, `rgba(52, 58, 64, ${transparency})`, `rgba(135, 138, 153, ${transparency})`
    ];
    let index = areaData.indexOf(areaId);
    
    if (index !== -1) {
      return color[index % color.length];
    } else {
      return color[areaId % color.length];
    }
  }

  // -- Return number functions
  getRandomIndices(max: number, count: number): number[] {
    if (max < count) count = max
    const indices: any[] = [];
    while (indices.length < count) {
        const randomIndex = Math.floor(Math.random() * max);
        if (!indices.includes(randomIndex)) {
            indices.push(randomIndex);
        }
    }
    return indices;
  }

  getTaskPercentage(totalActivity: number, totalChecklist: number): number {
    let result = Math.floor((totalChecklist / totalActivity) * 100);
    if (isNaN(result)) result = 0
    return result
  }

  getDayCount(lastUpdatedDate: Date, dateNow: Date): number | null {
    if (lastUpdatedDate !== null) {
      const msDifference = new Date(dateNow).getTime() - new Date(lastUpdatedDate).getTime();
      const dayDifference = msDifference / (1000 * 60 * 60 * 24);
      return Math.floor(dayDifference);
    } else return null
  }

  getPeriodDayCount(period: string): number {
    period = period.toUpperCase()
    const multiplier: { [key: string]: number } = {
      'D': 1,
      'W': 7,
      'M': 30,
      'Y': 365
    };
  
    const regex = /^(\d+)?([DWMY])$/;
    const matches = period.match(regex);
  
    if (matches) {
      const count = matches[1] ? parseInt(matches[1]) : 1;
      const unit = matches[2];
      return count * multiplier[unit];
    } else {
      throw new Error('The string format is not valid');
    }
  }
  
  // Returns array
  getUniqueData(arr: any[], property: string): any[] {
    let uniqueData: { [key: string]: any } = {};
    let result: any[] = [];
  
    for (let obj of arr) {
      let value = obj[property];
      if (!uniqueData[value]) {
        uniqueData[value] = obj;
        result.push(obj);
      }
    }
  
    return result;
  }

  isFirstOrLastIndex(array: any[], element: any) {
    if (array.length === 0) {
        return false;
    }

    if (JSON.stringify(array[0]) === JSON.stringify(element)) {
        return true;
    }
    
    if (JSON.stringify(array[array.length - 1]) === JSON.stringify(element)) {
        return true;
    }
    
    return false;
}

  // -- Show alerts
  showSuccessAlert(message?: string, cancelMessage?: string) {
    return Swal.fire({
      title: 'Success!',
      text: message ? message : 'Great job!',
      icon: 'success',
      showDenyButton: cancelMessage ? true : false,
      denyButtonColor: 'rgb(240, 101, 72)',
      confirmButtonText: 'OK',
      denyButtonText: cancelMessage ? cancelMessage : 'Cancel'
    })
  }

  async showServerErrorAlert(message: string = Const.ERR_SERVER_MSG, title: string = Const.ERR_SERVER_TITLE) {
    return this.showErrorAlert(message, title, 'Retry').then((result) => {
      if (result.value) location.reload()
    })
  }

  showErrorAlert(message?: string, title?: string, confirmButton?: string) {
    return Swal.fire({
      title: title ? title : 'Not Found',
      text: message ? message : 'Something went wrong',
      icon: 'error',
      showCloseButton: true,
      confirmButtonText: confirmButton ? confirmButton : 'Close'
    })
  }

  showDeleteWarningAlert(message?: string) {
    return Swal.fire({
      title: "Are you sure?",
      text: message ? message : "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "rgb(243, 78, 78)",
      confirmButtonText: "Delete",
    })
  }

  showTextInputAlert(title?: string, message?: string, placeholder?: string, confirmButton?: string) {
    return Swal.fire({
      input: 'text',
      title: title ? title : 'Alert',
      text: message ? message : 'Are you sure?',
      showCancelButton: true,
      inputPlaceholder: placeholder ? placeholder : 'Input text',
      confirmButtonText: confirmButton ? confirmButton : 'Submit',
      confirmButtonColor: '#556ee6',
      cancelButtonColor: '#f46a6a',
      allowOutsideClick: false
    })
  }

}
