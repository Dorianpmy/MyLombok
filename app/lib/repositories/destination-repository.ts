import {
  DEFAULT_DESTINATION_ID,
  destinations,
  isDestinationId,
} from "../../data/destinations";
import type { Destination, DestinationId } from "../../data/destination-types";

export const destinationRepository = {
  list(): readonly Destination[] {
    return destinations;
  },

  getById(id: string): Destination | null {
    return destinations.find((destination) => destination.id === id) ?? null;
  },

  getDefault(): Destination {
    return destinations.find((destination) => destination.id === DEFAULT_DESTINATION_ID)!;
  },

  resolve(value?: string | null): Destination {
    return value && isDestinationId(value)
      ? this.getById(value) ?? this.getDefault()
      : this.getDefault();
  },

  isEnabled(id: string): id is DestinationId {
    return isDestinationId(id);
  },
};
