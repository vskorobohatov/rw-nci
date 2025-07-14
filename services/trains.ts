import { API_URL } from "@/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export interface Train {
  id?: string;
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

  private async getAuthHeaders() {
    const token = await AsyncStorage.getItem("jwt");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getTrains() {
    const headers = await this.getAuthHeaders();
    const res = await this.api.get("/trains/list.php", { headers });
    return res.data;
  }

  async addTrain(train: Train) {
    const headers = await this.getAuthHeaders();
    const res = await this.api.post("/trains/create.php", train, { headers });
    return res.data;
  }

  async editTrain(id: string) {
    const headers = await this.getAuthHeaders();
    const res = await this.api.post("/trains/update.php", id, { headers });
    return res.data;
  }

  async deleteTrain(id: string): Promise<void> {
    const headers = await this.getAuthHeaders();
    await this.api.delete(`/trains/delete.php`, { params: { id }, headers });
  }
}

export const TrainsService = new TrainsServiceClass();
