import { Train } from "@/services/trains";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EVENTS_STORAGE_KEY = "events";

export interface Event {
  id: string;
  type: string;
  action: string;
  train: Train;
  date: Date;
  fullName: string;
  documentId: string;
  comment: string;
}

export const getEvents = async () => {
  const savedEvents = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
  let events = [];
  if (savedEvents) {
    events = JSON.parse(savedEvents);
  }
  return events;
};

export const addEvent = async (newEvent: Record<string, any>) => {
  const savedEvents = await getEvents();
  await AsyncStorage.setItem(
    EVENTS_STORAGE_KEY,
    JSON.stringify([...savedEvents, newEvent])
  );
};

export const getEventDetails = async (id: string | number) => {
  const savedEvents = await getEvents();
  return savedEvents.find((it: any) => it.id === id);
};

export const deleteEvent = async (id: string | number) => {
  const savedEvents = await getEvents();
  await AsyncStorage.setItem(
    EVENTS_STORAGE_KEY,
    JSON.stringify(savedEvents.filter((it: any) => it.id !== id))
  );
};

export const cleanAllEvents = async () => {
  const savedEvents = await getEvents();
  savedEvents.forEach(async (event: Event) => await deleteEvent(event.id));
};
