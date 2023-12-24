import {
  Canister,
  query,
  text,
  update,
  Principal,
  StableBTreeMap,
  nat64,
  ic,
} from "azle";

// Id principal
const Id = Principal;
type Id = typeof Id.tsType;

// Type
const Type = text;
type Type = typeof Type.tsType;

// Buat list array antrian
let UserQueue = StableBTreeMap<Id, Type>(0);

export default Canister({
  deleteQueue: update([Id], text, (id) => {
    const removedType = UserQueue.remove(id);

    if (removedType) {
      return `Berhasil menghapus ${id} dari antrian`;
    } else {
      return `ID ${id} tidak ditemukan dalam antrian`;
    }
  }),
  // Menampilkan semua antrian
  totalQueue: query([], text, () => {
    return `Total antrian ${UserQueue.len()}`;
  }),
  getMyQueue: query([Id], text, (id) => {
    const myType = UserQueue.get(id);

    if (myType) {
      return `Urutan antrian ${id} adalah ${myType}`;
    } else {
      return `ID ${id} tidak ditemukan dalam antrian`;
    }
  }),
  addMyQueue: update([Type], text, (type) => {
    // Mendapatkan total antrian saat ini
    const totalQueueNumber: nat64 = UserQueue.len();

    // Menambahkan data antrian berdasarkan ic caller
    UserQueue.insert(ic.caller(), type);

    return `Berhasil mengambil urutan dengan nomor urut ${
      totalQueueNumber + 1n
    }`;
  }),
  addQueue: update([Id, Type], text, (id, type) => {
    // Mendapatkan total antrian saat ini
    const totalQueueNumber: nat64 = UserQueue.len();

    // Menambahkan data antrian
    UserQueue.insert(id, type);

    return `Berhasil memasukkan ${id} (${type}) ke dalam antrian. Dengan nomor urut ${
      totalQueueNumber + 1n
    }`;
  }),
});
