import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const GET_FILES_ENDPOINT = 'inventories/processes';

@Injectable({
    providedIn: 'root'
})
export class ProcessService {

    public baseURL = 'http://190.144.39.246:8080/alpha/fieldvision/pc/api/develop/public/';
    public GET_TASKS = 'tasks';
    public GET_RESOURCE_INSTANCES = 'resourceinstances';
    public GET_FORMS = 'forms';
    public token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpbiI6ImFkbWluZGF0YSIsImlkX2NvbXBhbnkiOiI1NmY1NTcwOWVmZTllOGQ1NzU3NjhhNTQiLCJtb2R1bGVzIjpbeyJuYW1lIjoiUGxhbm5pbmdUcmFja2luZyIsImFjdGlvbnMiOnsiQ1JFQVRFIjp0cnVlLCJSRUFEIjp0cnVlLCJVUERBVEUiOnRydWUsIkRFTEVURSI6dHJ1ZX19LHsibmFtZSI6IlJlc291cmNlVHJhY2tpbmciLCJhY3Rpb25zIjp7IkNSRUFURSI6dHJ1ZSwiUkVBRCI6dHJ1ZSwiVVBEQVRFIjp0cnVlLCJERUxFVEUiOnRydWV9fSx7Im5hbWUiOiJDb21wYW5pZXMiLCJhY3Rpb25zIjp7IkNSRUFURSI6dHJ1ZSwiUkVBRCI6dHJ1ZSwiVVBEQVRFIjp0cnVlLCJERUxFVEUiOnRydWV9fSx7Im5hbWUiOiJSZXNvdXJjZXMiLCJhY3Rpb25zIjp7IkNSRUFURSI6dHJ1ZSwiUkVBRCI6dHJ1ZSwiVVBEQVRFIjp0cnVlLCJERUxFVEUiOnRydWV9fSx7Im5hbWUiOiJVc2VycyIsImFjdGlvbnMiOnsiQ1JFQVRFIjp0cnVlLCJSRUFEIjp0cnVlLCJVUERBVEUiOnRydWUsIkRFTEVURSI6dHJ1ZX19LHsibmFtZSI6IkZvcm1zIiwiYWN0aW9ucyI6eyJDUkVBVEUiOnRydWUsIlJFQUQiOnRydWUsIlVQREFURSI6dHJ1ZSwiREVMRVRFIjp0cnVlLCJVUERBVEVfUFJPVEVDVEVEIjp0cnVlfX0seyJuYW1lIjoiU2NoZWR1bGluZyIsImFjdGlvbnMiOnsiQ1JFQVRFIjp0cnVlLCJSRUFEIjp0cnVlLCJVUERBVEUiOnRydWUsIkRFTEVURSI6dHJ1ZX19LHsibmFtZSI6IlJlZ2lzdGVycyIsImFjdGlvbnMiOnsiQ1JFQVRFIjp0cnVlLCJSRUFEIjp0cnVlLCJVUERBVEUiOnRydWUsIkRFTEVURSI6dHJ1ZX19LHsibmFtZSI6IlRhc2tzIiwiYWN0aW9ucyI6eyJDUkVBVEUiOnRydWUsIlJFQUQiOnRydWUsIlVQREFURSI6dHJ1ZSwiREVMRVRFIjp0cnVlLCJDUkVBVEVfUkVHSVNURVIiOnRydWUsIlVQREFURV9SRUdJU1RFUiI6dHJ1ZSwiREVMRVRFX1JFR0lTVEVSIjp0cnVlfX0seyJuYW1lIjoiQXVkaXQiLCJhY3Rpb25zIjp7IlJFQUQiOnRydWV9fSx7Im5hbWUiOiJEYXNoYm9hcmQiLCJhY3Rpb25zIjp7IkNSRUFURSI6dHJ1ZSwiUkVBRCI6dHJ1ZSwiVVBEQVRFIjp0cnVlLCJERUxFVEUiOnRydWV9fSx7Im5hbWUiOiJsb2dpbiIsImFjdGlvbnMiOnsiUE9TVCI6dHJ1ZX19LHsibmFtZSI6IlRPRE8iLCJhY3Rpb25zIjp7IkNSRUFURSI6dHJ1ZSwiUkVBRCI6dHJ1ZSwiVVBEQVRFIjp0cnVlLCJERUxFVEUiOnRydWUsIkNSRUFURV9SRUdJU1RFUiI6dHJ1ZSwiVVBEQVRFX1JFR0lTVEVSIjp0cnVlLCJERUxFVEVfUkVHSVNURVIiOnRydWV9fSx7Im5hbWUiOiJGb3Jtc09ubGluZSIsImFjdGlvbnMiOnsiQ1JFQVRFIjp0cnVlLCJSRUFEIjp0cnVlLCJVUERBVEUiOnRydWUsIlVQREFURV9GT1JNQ09OVEVOVCI6dHJ1ZSwiREVMRVRFIjp0cnVlLCJVUERBVEVfV0lUSE9VVF9SRVNUUklDVElPTiI6dHJ1ZX19LHsibmFtZSI6IlRhc2tzTG9hZGVyIiwiYWN0aW9ucyI6eyJDUkVBVEUiOnRydWUsIlJFQUQiOnRydWUsIlVQREFURSI6dHJ1ZSwiREVMRVRFIjp0cnVlfX0seyJuYW1lIjoiUm91dGluZ3MiLCJhY3Rpb25zIjp7IkNSRUFURSI6dHJ1ZSwiUkVBRCI6dHJ1ZSwiVVBEQVRFIjp0cnVlLCJERUxFVEUiOnRydWV9fSx7Im5hbWUiOiJEYXRhYmFzZSIsImFjdGlvbnMiOnsiQ1JFQVRFIjp0cnVlLCJSRUFEIjp0cnVlLCJVUERBVEUiOnRydWUsIkRFTEVURSI6dHJ1ZSwiVVBEQVRFX1BST1RFQ1RFRCI6dHJ1ZX19LHsibmFtZSI6IlJlcG9ydE1hbmFnZXIiLCJhY3Rpb25zIjp7IlJFQUQiOnRydWV9fSx7Im5hbWUiOiJPcmRlcnMiLCJhY3Rpb25zIjp7IkNSRUFURSI6dHJ1ZSwiUkVBRCI6dHJ1ZSwiVVBEQVRFIjp0cnVlLCJERUxFVEUiOnRydWV9fSx7Im5hbWUiOiJJbnZlbnRvcnlfTWFuYWdlbWVudCIsImFjdGlvbnMiOnsiQ1JFQVRFIjp0cnVlLCJSRUFEIjp0cnVlLCJVUERBVEUiOnRydWUsIkRFTEVURSI6dHJ1ZX19LHsibmFtZSI6IlN0YXRpc3RpY3MiLCJhY3Rpb25zIjp7IkNSRUFURSI6dHJ1ZSwiUkVBRCI6dHJ1ZSwiVVBEQVRFIjp0cnVlLCJERUxFVEUiOnRydWV9fSx7Im5hbWUiOiJTZXR0aW5ncyIsImFjdGlvbnMiOnsiQ1JFQVRFIjp0cnVlLCJSRUFEIjp0cnVlLCJVUERBVEUiOnRydWUsIkRFTEVURSI6dHJ1ZX19LHsibmFtZSI6Ikdsb3NzYXJ5IiwiYWN0aW9ucyI6eyJDUkVBVEUiOnRydWUsIlJFQUQiOnRydWUsIlVQREFURSI6dHJ1ZSwiREVMRVRFIjp0cnVlfX0seyJuYW1lIjoiQ2F0YWxvZ3MiLCJhY3Rpb25zIjp7IkNSRUFURSI6dHJ1ZSwiUkVBRCI6dHJ1ZSwiVVBEQVRFIjp0cnVlLCJERUxFVEUiOnRydWV9fSx7Im5hbWUiOiJLaXRzIiwiYWN0aW9ucyI6eyJDUkVBVEUiOnRydWUsIlJFQUQiOnRydWUsIlVQREFURSI6dHJ1ZSwiREVMRVRFIjp0cnVlfX0seyJuYW1lIjoiV2FyZWhvdXNlcyIsImFjdGlvbnMiOnsiQ1JFQVRFIjp0cnVlLCJSRUFEIjp0cnVlLCJVUERBVEUiOnRydWUsIkRFTEVURSI6dHJ1ZX19LHsibmFtZSI6IldhcmVob3VzZXNfUnVsZXMiLCJhY3Rpb25zIjp7IkNSRUFURSI6dHJ1ZSwiUkVBRCI6dHJ1ZSwiVVBEQVRFIjp0cnVlLCJERUxFVEUiOnRydWV9fSx7Im5hbWUiOiJQcm9kdWN0c19TdGF0ZXMiLCJhY3Rpb25zIjp7IkNSRUFURSI6dHJ1ZSwiUkVBRCI6dHJ1ZSwiVVBEQVRFIjp0cnVlLCJERUxFVEUiOnRydWV9fSx7Im5hbWUiOiJXb3JrZmxvd01hbmFnZXIiLCJhY3Rpb25zIjp7IkNSRUFURSI6dHJ1ZSwiUkVBRCI6dHJ1ZSwiVVBEQVRFIjp0cnVlLCJERUxFVEUiOnRydWV9fV0sInJvdXRpbmdUb29sIjoiR29vZ2xlIG1hcHMtdyIsIm1hcCI6eyJsYXQiOjQuNjA5NzEsImxuZyI6LTc0LjA4MTc1LCJwcm9qIjoiRVBTRzo0MzI2In0sInRyYWNraW5nRnJlcXVlbmN5IjoyLCJmbGVldHMiOltdLCJkZGIiOjI1MCwiZW9mIjotMSwic3ViIjoiNTc4N2FhZTE0NDk5ZTMyNDYwMDM0MDQ1IiwiaXNzIjoiaHR0cDovLzE5MC4xNDQuMzkuMjQ2OjgwODAvYWxwaGEvZmllbGR2aXNpb24vcGMvYXBpL2RldmVsb3AvcHVibGljLy9sb2dpbiIsImlhdCI6MTU3NTg3MjYxNiwiZXhwIjoxNTc1OTU5MDE2LCJuYmYiOjE1NzU4NzI2MTYsImp0aSI6Im9iY1lIYUFvQnJoQ2NzQ1gifQ.x2N-TLlCjwjJJmnIFpSt-a9x0NoKTis_w69F_Yf8foE';
    public contentType = 'application/json';
    constructor(private _http: HttpClient) {
    }

    public getTask(): Observable<any> {
        console.log('alfredo a ver ');
        return this._http
            .get(this.baseURL.concat(this.GET_TASKS), this.options({
                _dc: 1575905178153,
                view: ["code", "name", "status", "type", "arrival_time", "id_resourceInstance", "forms", "duration", "trackingId", "location", "address", "allForms"],
                filters: { "and": [{ "field": "id_company", "comparison": "eq", "value": "56f55709efe9e8d575768a54" }, { "field": "status", "comparison": "in", "value": ["PENDIENTE", "CHECKIN"] }, { "field": "arrival_time", "comparison": "gte", "value": "2019-12-07 00:00:00" }, { "field": "id_company", "comparison": "eq", "value": "56f55709efe9e8d575768a54" }] },
                relations: ["resourceInstance"],
                page: 1,
                start: 0,
                limit: 15,
                sort: [{ "property": "id_resourceInstance", "direction": "ASC" }, { "property": "arrival_time", "direction": "DESC" }]
            }))
            .pipe(
                catchError(err => {
                    return throwError(err.error);
                })
            );
    }


    public getResourceinstances(): Observable<any> {
        console.log('alfredo a ver ');
        return this._http
            .get(this.baseURL.concat(this.GET_RESOURCE_INSTANCES), this.options({
                _dc: 1575915459799,
                filters: { "and": [{ "field": "id_company", "comparison": "eq", "value": "56f55709efe9e8d575768a54" }, { "field": "login", "comparison": "lk", "value": "" }] },
                page: 1,
                start: 0,
                limit: 25,
                sort: [{ "property": "_id", "direction": "DESC" }],
            }))
            .pipe(
                catchError(err => {
                    return throwError(err.error);
                })
            );
    }

    public getForms(): Observable<any> {
        console.log('alfredo a ver ');
        return this._http
            .get(this.baseURL.concat(this.GET_FORMS), this.options({
                _dc: 1575917232880,
                filters: { "and": [{ "field": "id_company", "comparison": "eq", "value": "56f55709efe9e8d575768a54" }, { "field": "name", "comparison": "lk", "value": "" }] },
                page: 1,
                start: 0,
                limit: 25,
                sort: [{ "property": "_id", "direction": "DESC" }]
            }))
            .pipe(
                catchError(err => {
                    return throwError(err.error);
                })
            );
    }

    public options(params?: any, isFile?: boolean, boundary?: boolean): { headers: HttpHeaders, params?: HttpParams } {
        return { headers: isFile ? this.headersByFile(boundary) : this.headers, params: this.params(params) }
    }

    public params(parameters?: any): HttpParams {
        let params: any = parameters;
        if (params) {
            if (params.filters) {
                params.filters = JSON.stringify(parameters.filters);
            }
            if (params.view) {
                params.view = JSON.stringify(parameters.view);
            }
            if (params.relations) {
                params.relations = JSON.stringify(parameters.relations);
            }
            if (params.sort) {
                params.sort = JSON.stringify(parameters.sort);
            }
        }
        return params as HttpParams;
    }
    public headersByFile(boundary: boolean): HttpHeaders {
        let _headers = {
            'Authorization': this.token,
            'Content-Type': this.contentType
        };
        const headers = new HttpHeaders(_headers);
        return headers;
    }

    public get headers(): HttpHeaders {
        const headers = new HttpHeaders({
            'Authorization': this.token,
            'Content-Type': this.contentType
        });
        return headers;
    }
}
