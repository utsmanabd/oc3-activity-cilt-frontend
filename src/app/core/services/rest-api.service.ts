import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of, tap } from "rxjs";
import { GlobalComponent } from "../../global-component";

@Injectable({
  providedIn: "root",
})
export class restApiService {
  public httpOptions(): any {
    let token = localStorage.getItem("token");
    return {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        // "Authorization": `${token}`,
      }),
    };
  }

  constructor(private http: HttpClient) {}

  cachedActorData: any;

  cachedActivityData: any;
  cachedAreaData: any;
  cachedMachineAreaData: any;

  cachedTaskData: any;
  cachedTaskDataByDate: any;

  cachedFindingCountData: any
  cachedFindingNotOkData: any
  cachedFindingUndoneData: any
  cachedFindingChecklistData: any

  resetCachedData(cachedData?: any) {
    if (cachedData) {
      cachedData = undefined
    } else {
      this.cachedActorData = undefined
      this.cachedActivityData = undefined
      this.cachedAreaData = undefined
      this.cachedMachineAreaData = undefined
      this.cachedTaskData = undefined
      this.cachedTaskDataByDate = undefined
      this.cachedFindingCountData = undefined
      this.cachedFindingNotOkData = undefined
      this.cachedFindingUndoneData = undefined
      this.cachedFindingChecklistData = undefined
    }
  }

  removeImage(image: string) {
    return this.http.delete(GlobalComponent.API_URL + `master/` + GlobalComponent.image + image, this.httpOptions())
  }

  getImage(image: string) {
    return this.http.get(
      GlobalComponent.API_URL + GlobalComponent.image + image,
      this.httpOptions()
    )
  }

  getActorData(): Observable<any> {
    if (this.cachedActorData !== undefined) {
      return of(this.cachedActorData);
    } else {
      return this.http
        .get(
          GlobalComponent.API_URL + GlobalComponent.actor,
          this.httpOptions()
        )
        .pipe(
          tap((data) => {
            this.cachedActorData = data;
          })
        );
    }
  }

  getActorDataById(id: number): Observable<any> {
    return this.http.get(
      GlobalComponent.API_URL + GlobalComponent.actorId + id,
      this.httpOptions()
    );
  }

  postActorData(actorData: any): Observable<any> {
    return this.http
      .post(
        GlobalComponent.API_URL + GlobalComponent.actor,
        { form_data: actorData },
        this.httpOptions()
      )
      // .pipe(
      //   tap((res: any) => {
      //     this.cachedActorData.data.push({
      //       actor_id: res.data[0],
      //       first_name: actorData.first_name,
      //       last_name: actorData.last_name,
      //     });
      //   })
      // );
  }

  putActorData(id: number, actorData: any): Observable<any> {
    return this.http
      .put(
        GlobalComponent.API_URL + GlobalComponent.actorId + id,
        { form_data: actorData },
        this.httpOptions()
      )
      // .pipe(
      //   tap(() => {
      //     const dataIndex = this.cachedActorData.data.findIndex(
      //       (actor: any) => actor.actor_id === id
      //     );
      //     if (dataIndex !== -1) {
      //       this.cachedActorData.data[dataIndex] = {
      //         actor_id: id,
      //         first_name: actorData.first_name,
      //         last_name: actorData.last_name,
      //       };
      //     }
      //   })
      // );
  }

  deleteActorData(id: number): Observable<any> {
    return this.http
    .delete(
      GlobalComponent.API_URL + GlobalComponent.actorId + id,
      this.httpOptions()
    )
    .pipe(
      tap(() => {
        const dataIndex = this.cachedActorData.data.findIndex(
          (actor: any) => actor.actor_id === id
        );
        if (dataIndex !== -1) {
          this.cachedActorData.data.splice(dataIndex, 1);
        }
      })
    )
  }

  // Activity API

  getActivityData() {
    if (this.cachedActivityData !== undefined) {
      return of(this.cachedActivityData)
    } else {
      return this.http.get(GlobalComponent.API_URL + GlobalComponent.activity, this.httpOptions()).pipe(
        tap((data) => {
          this.cachedActivityData = data;
        })
      );
    }
  }

  getActivityDataByAreaId(areaId: any) {
    return this.http.get(GlobalComponent.API_URL + GlobalComponent.activityId + `area/${areaId}`, this.httpOptions())
  }

  insertActivityData(data: any) {
    return this.http.post(GlobalComponent.API_URL + GlobalComponent.activity, {form_data: data}, this.httpOptions()).pipe(
      tap(() => {
        this.resetCachedData()
      })
    )
  }

  updateActivityData(id: number, data: any) {
    return this.http.put(GlobalComponent.API_URL + GlobalComponent.activityId + id, {form_data: data}, this.httpOptions()).pipe(
      tap(() => {
        this.resetCachedData()
      })
    )
  }

  // Area API

  getAreaData() {
    if (this.cachedAreaData !== undefined) {
      return of(this.cachedAreaData)
    } else {
      return this.http.get(GlobalComponent.API_URL + GlobalComponent.area, this.httpOptions()).pipe(
        tap((data) => {
          this.cachedAreaData = data;
        })
      );
    }
  }

  insertAreaData(data: any) {
    return this.http.post(GlobalComponent.API_URL + GlobalComponent.area, {form_data: data}, this.httpOptions()).pipe(
      tap(() => {
        this.resetCachedData()
      })
    )
  }

  updateAreaData(id: any, data: any) {
    return this.http.put(GlobalComponent.API_URL + GlobalComponent.areaId + id, {form_data: data}, this.httpOptions()).pipe(
      tap(() => {
        this.resetCachedData()
      })
    )
  }

  // Machine Area API

  getMachineAreaData() {
    if (this.cachedMachineAreaData !== undefined) {
      return of(this.cachedMachineAreaData)
    } else {
      return this.http.get(GlobalComponent.API_URL + GlobalComponent.machineArea, this.httpOptions()).pipe(
        tap((data) => {
          this.cachedMachineAreaData = data;
        })
      );
    }
  }

  getMachineAreaDataByAreaId(id: number) {
    return this.http.get(GlobalComponent.API_URL + GlobalComponent.machineAreaId + `area/` + id, this.httpOptions())
  }

  insertMachineAreaData(data: any) {
    return this.http.post(GlobalComponent.API_URL + GlobalComponent.machineArea, {form_data: data}, this.httpOptions()).pipe(
      tap(() => {
        this.resetCachedData()
      })
    )
  }

  updateMachineAreaData(id: number, data: any) {
    return this.http.put(GlobalComponent.API_URL + GlobalComponent.machineAreaId + id, {form_data: data}, this.httpOptions()).pipe(
      tap(() => {
        this.resetCachedData()
      })
    )
  }

  taskId: number | null = null
  setTaskId(taskId: number) {
    this.taskId = taskId
  }
  getTaskId(): number | null {
    return this.taskId
  }

  areaId: number | null = null
  setAreaId(areaId: number) {
    this.areaId = areaId
  }
  getAreaId(): number | null {
    return this.areaId
  }

  getTaskData() {
    if (this.cachedTaskData !== undefined) {
      return of(this.cachedTaskData)
    } else {
      return this.http.get(GlobalComponent.API_URL + GlobalComponent.task, this.httpOptions()).pipe(
        tap((data) => {
          this.cachedTaskData = data;
        })
      );
    }
  }

  getTaskDataByDate(month: number, year: number) {
    if (this.cachedTaskDataByDate) {
      return of(this.cachedTaskDataByDate)
    } else {
      return this.http.get(GlobalComponent.API_URL + GlobalComponent.taskId + `date/${month}/${year}`, this.httpOptions()).pipe(
        tap((data) => {
          this.cachedTaskDataByDate = data
        })
      )
    }
  }

  insertTaskData(taskData: any) {
    return this.http.post(GlobalComponent.API_URL + GlobalComponent.task, {form_data: taskData}, this.httpOptions()).pipe(
      tap(() => {
        this.resetCachedData()
      })
    )
  }

  getTaskActivityById(taskId: number, mAreaId: number) {
    return this.http.get(GlobalComponent.API_URL + GlobalComponent.taskActivityId + `id/${taskId}/${mAreaId}`, this.httpOptions())
  }

  getCountTaskActivityById(taskId: number, mAreaId: number) {
    return this.http.get(GlobalComponent.API_URL + GlobalComponent.taskActivityId + `count/${taskId}/${mAreaId}`, this.httpOptions())
  }

  insertTaskActivity(data: any) {
    return this.http.post(GlobalComponent.API_URL + GlobalComponent.taskActivity, {form_data: data}, this.httpOptions()).pipe(
      tap(() => {
        this.resetCachedData()
      })
    )
  }

  updateTaskActivity(data: any) {
    return this.http.post(GlobalComponent.API_URL + GlobalComponent.taskActivityId + `batch`, {form_data: data}, this.httpOptions()).pipe(
      tap(() => {
        this.resetCachedData()
      })
    )
  }

  uploadMultipleImage(files: FormData) {
    return this.http.post(GlobalComponent.API_URL + GlobalComponent.uploadMultiple, files)
  }

  getFindingCount() {
    if (this.cachedFindingCountData) {
      return of(this.cachedFindingCountData)
    } else {
      return this.http.get(GlobalComponent.API_URL + GlobalComponent.finding, this.httpOptions()).pipe(
        tap((data) => {
          this.cachedFindingCountData = data
        })
      )
    }
  }

  getFindingCountByDate(month: number, year: number) {
    return this.http.get(GlobalComponent.API_URL + GlobalComponent.findingDate + `${month}/${year}`, this.httpOptions())
  }

  getFindingNotOk() {
    if (this.cachedFindingCountData) {
      return of(this.cachedFindingCountData)
    } else {
      return this.http.get(GlobalComponent.API_URL + GlobalComponent.findingNotOk, this.httpOptions()).pipe(
        tap((data) => {
          this.cachedFindingNotOkData = data
        })
      )
    }
  }

  getFindingNotOkByDate(month: number, year: number) {
    return this.http.get(GlobalComponent.API_URL + GlobalComponent.findingNotOkDate + `${month}/${year}`, this.httpOptions())
  }

  getFindingNotOkById(taskId: number) {
    return this.http.get(GlobalComponent.API_URL + GlobalComponent.findingNotOk + `${taskId}`, this.httpOptions())
  }

  getFindingUndone() {
    if (this.cachedFindingUndoneData) {
      return of(this.cachedFindingUndoneData)
    } else {
      return this.http.get(GlobalComponent.API_URL + GlobalComponent.findingUndone, this.httpOptions()).pipe(
        tap((data) => {
          this.cachedFindingUndoneData = data
        })
      )
    }
  }

  getFindingUndoneByDate(month: number, year: number) {
    return this.http.get(GlobalComponent.API_URL + GlobalComponent.findingUndoneDate + `${month}/${year}`, this.httpOptions())
  }

  getFindingUndoneById(taskId: number) {
    return this.http.get(GlobalComponent.API_URL + GlobalComponent.findingUndone + `${taskId}`, this.httpOptions())
  }

  getFindingChecklist() {
    if (this.cachedFindingChecklistData) {
      return of(this.cachedFindingChecklistData)
    } else {
      return this.http.get(GlobalComponent.API_URL + GlobalComponent.findingChecklist, this.httpOptions()).pipe(
        tap((data) => {
          this.cachedFindingChecklistData = data
        })
      )
    }
  }

  getFindingChecklistByDate(month: number, year: number) {
    return this.http.get(GlobalComponent.API_URL + GlobalComponent.findingChecklistDate + `${month}/${year}`, this.httpOptions())
  }

  getFindingChecklistById(taskId: number) {
    return this.http.get(GlobalComponent.API_URL + GlobalComponent.findingChecklist + `${taskId}`, this.httpOptions())
  }

  getChecklistCategoryByDate(month: number, year: number) {
    return this.http.get(GlobalComponent.API_URL + GlobalComponent.checklistCategory + `${month}/${year}`, this.httpOptions())
  }
}
