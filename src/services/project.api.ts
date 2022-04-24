import { Project } from "../components/project/Project.model";
import {ApiResponse, ApiWrapper} from "./api";

export  class ProjectApi extends ApiWrapper{
    async getAllProjects(){
        const response: ApiResponse<Project[]> =  await this.apisauce.get('project/')
        return this.prepareResponse<Project[]>(response);
    }

    async createProject(project: Project){
        const response: ApiResponse<any> =  await this.apisauce.post('project/', project)
        return this.prepareResponse<any>(response);
    }

    async editProject(project: Project){
        const response: ApiResponse<any> =  await this.apisauce.put(`project/${project?.id}/`, project)
        return this.prepareResponse<any>(response);
    }
}

export default new ProjectApi();