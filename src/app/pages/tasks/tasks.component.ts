import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/core/services/common.service';
import { restApiService } from 'src/app/core/services/rest-api.service';
import { Const } from 'src/app/core/static/const';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent {
  tableColumn = ["#", "Date", "Area", "Progress", "Action"];
  tasksData: any;
  areaData: any;
  activityIdData: any[] =[]
  index: number = 0;
  activePages: number[] = [];

  pageSize = 10;
  currentPage = 1;
  totalPages!: number;
  paginatedTasksData: any[] = [];
  pages: number[] = [];

  searchKeyword: string = "";
  successMessage: string = "";
  isSuccess: boolean = false;

  selectedArea!: string
  selectedDate: string = ''
  isSelectedAreaEmpty: boolean = false
  isSelectedDateEmpty: boolean = false

  areaIdArray: any[] = []
  loading: boolean = false
  isLoading: boolean = false
  

  constructor(
    private apiService: restApiService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    public common: CommonService
  ) {
    this.loading = true
  }

  async ngOnInit() {
    await this.getTaskData().finally(() => this.loading = false)
    await this.getAreaData().finally(() => this.loading = false)
  }

  ngOnDestroy() {
    this.activityIdData = []
    this.modalService.dismissAll()
  }

  onAddTask() {
    this.validateForm()
    if (!this.isSelectedAreaEmpty && !this.isSelectedDateEmpty) {
      let taskData = {
        area_id: this.selectedArea,
        date: this.selectedDate
      }
      this.insertTaskData(taskData)
      this.isLoading = true
    }
  }
  
  insertTaskData(data: any) {
    this.apiService.insertTaskData(data).subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.getActivityByAreaId(res.data[0], data.area_id)
        }
      },
      error: (err: any) => {
        this.isLoading = false
        console.error(err)
        this.common.showErrorAlert(Const.ERR_INSERT_MSG("Task"), err)
      },
      complete: () => this.getTaskData()
    })
  }

  getActivityByAreaId(taskId: any, areaId: any) {
    this.apiService.getActivityDataByAreaId(areaId).subscribe({
      next: (res: any) => {
        let areaData: any[] = res.data
        areaData.forEach(data => {
          this.activityIdData.push({
            task_id: taskId, 
            activity_id: data.activity_id
          })
        })
      },
      error: (err) => {
        console.error(err)
        this.common.showErrorAlert(Const.ERR_GET_MSG("Task"), err)
      },
      complete: () => {
        if (this.activityIdData.length > 0) {
          this.insertTaskActivity(this.activityIdData)
        }
      }
    })
  }

  insertTaskActivity(data: any) {
    this.apiService.insertTaskActivity(data).subscribe({
      next: (res) => this.modalService.dismissAll(),
      error: (err) => {
        this.isLoading = false
        console.error(err)
        this.common.showErrorAlert(Const.ERR_INSERT_MSG("Task Activity"), err)
      }
    })
  }

  openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => this.resetModalValue(),
			(reason) => this.resetModalValue()
    )
  }

  resetModalValue() {
    if (this.areaData !== undefined) {
      this.selectedArea = this.areaIdArray[0]
    } else this.selectedArea = ''
    this.selectedDate = ''
    this.activityIdData = []
    this.isSelectedDateEmpty = false
    this.isLoading = false
  }

  onIdentityTaskClick(tasks: any): void {
    let taskId = tasks.task_id
    let areaId = tasks.area_id
    this.router.navigate([`/tasks/identity-task/${taskId}/${areaId}`]);
  }

  validateForm() {
    this.isSelectedAreaEmpty = this.selectedArea === ""
    this.isSelectedDateEmpty = this.selectedDate.trim() === ""
  }

  async getTaskData() {
    return new Promise((resolve, reject) => {
      this.apiService.getTaskData().subscribe({
        next: (res: any) => {
          this.tasksData = res.data;
          this.totalPages = Math.ceil(this.tasksData.length / this.pageSize);
          this.updatePagination(this.tasksData);
          resolve(true)
        },
        error: (err) => {
          this.common.showServerErrorAlert(Const.ERR_GET_MSG("Task"), err);
          console.error(err)
          reject(err)
        }
      });
    })
    
  }

  async getAreaData() {
    return new Promise((resolve, reject) => {
      this.apiService.getAreaData().subscribe({
        next: (res: any) => {
          this.areaData = res.data;
          this.areaData.forEach((element: any) => {
            this.areaIdArray.push(element.area_id)
          });
        },
        error: (err) => {
          this.common.showServerErrorAlert(Const.ERR_GET_MSG("Area"), err);
          console.error(err)
          reject(err)
        },
        complete: () => {
          this.selectedArea = this.areaIdArray[0]
          resolve(true)
        }
      })
    })
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.updatePagination(this.tasksData);
    }
  }

  updatePagination(dataSource: any): void {
    this.index = (this.currentPage - 1) * this.pageSize;
    this.paginatedTasksData = dataSource.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );

    this.activePages = this.common.calculateActivePages(this.currentPage, this.totalPages);
  }

  applyFilter(): void {
    this.currentPage = 1;
    const filteredTasksData = this.tasksData.filter(
      (activity: any) =>      
        activity.area
          .toLowerCase()
          .includes(this.searchKeyword.trim().toLowerCase()) ||
        activity.progress
          .toLowerCase()
          .includes(this.searchKeyword.trim().toLowerCase())
    );
    this.totalPages = Math.ceil(filteredTasksData.length / this.pageSize);
    this.updatePagination(filteredTasksData);
  }
}
