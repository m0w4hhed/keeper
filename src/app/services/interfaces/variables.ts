import * as firebase from 'firebase'

export const resetBiayaDibayar = { // reset dibayar invoice / barang
    biaya_dibayar: false, // reset biaya_keep
}
export const resetTotalan = { // reset totalan invoice
    total: firebase.firestore.FieldValue.delete(),  // reset total
    biaya_keep: firebase.firestore.FieldValue.delete(), // reset biaya_keep
}
export const resetEkspedisi = {
    ekspedisi: firebase.firestore.FieldValue.delete()
}

export const resetInvoiceDibayar = {
    status: 'keep',
    waktuDibayar: firebase.firestore.FieldValue.delete()
}