import * as Mongoose from "mongoose";

export interface IWattage extends Mongoose.Document {
  watt: number;
  qty: number;
}

export interface IStreetMap extends Mongoose.Document {
  id: string;
  zone: string;
  lat: string;
  long: string;
  lighttype: string;
  lightcount: string;
  wattage: IWattage[];
  wardno: string;
  ccmsno: string;
}
export const WattageSchema = new Mongoose.Schema({
  watt: { type: Number, index: true },
  qty: { type: Number, index: true },
});

export const WattageModel = Mongoose.model<IWattage>('Wattage', WattageSchema);

export const StreetMapSchema = new Mongoose.Schema({
  id: { type: String, index: true },
  zone: { type: String, index: true },
  long: { type: String, index: true },
  lighttype: { type: String, index: true },
  lightcount: { type: String, index: true },
  wattage: [WattageSchema],
  wardno: { type: String, index: true },
  ccmsno: { type: String, index: true },
  lat: { type: String, index: true }
}, {
    timestamps: true
  });

export const StreetMapModel = Mongoose.model<IStreetMap>('StreetMap', StreetMapSchema);