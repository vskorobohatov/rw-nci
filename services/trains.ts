import { API_URL } from "@/config";
import axios from "axios";

export interface Train {
  id: string;
  number: string;
  name: string;
  time_in: string;
  time_out: string;
  schedule: string;
  stops: string;
  comment: string;
  [key: string]: any;
}

class TrainsServiceClass {
  private api = axios.create({
    baseURL: API_URL,
  });

  async getTrains(): Promise<Train[]> {
    const res = await this.api.get<Train[]>("/list");
    return res.data;
  }

  async addTrain(train: Omit<Train, "id">): Promise<Train> {
    const res = await this.api.post<Train>("/create", train);
    return res.data;
  }

  async editTrain(id: string, updates: Partial<Train>): Promise<Train> {
    const res = await this.api.put<Train>(`/trains`, updates, {
      params: { id },
    });
    return res.data;
  }

  async deleteTrain(id: string): Promise<void> {
    await this.api.delete(`/trains`, { params: { id } });
  }
}

export const TrainsService = new TrainsServiceClass();
