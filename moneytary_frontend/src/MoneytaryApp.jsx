import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MoneytaryApp = () => {
    const [tabungan, setTabungan] = useState(null);
    const [pemasukan, setPemasukan] = useState([]);
    const [pengeluaran, setPengeluaran] = useState([]);
    const [pemasukanData, setPemasukanData] = useState({ jumlah: "" });
    const [pengeluaranData, setPengeluaranData] = useState({ jumlah: "", tanggal: "" });
    const [loadingPemasukan, setLoadingPemasukan] = useState(false);
    const [loadingPengeluaran, setLoadingPengeluaran] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [sortCriteria, setSortCriteria] = useState("tanggal");
    const [sortOrder, setSortOrder] = useState("desc");

    const fetchTabungan = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/tabungan/");
            setTabungan(response.data.data);
        } catch (error) {
            console.error("Error fetching tabungan:", error);
        }
    };

    const fetchPengeluaran = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/tabungan/pengeluaran");
            let sortedData = response.data.data;
            if (sortCriteria === "tanggal") {
                sortedData = sortOrder === "desc"
                    ? sortedData.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
                    : sortedData.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
            } else if (sortCriteria === "jumlah") {
                sortedData = sortOrder === "desc"
                    ? sortedData.sort((a, b) => b.jumlah - a.jumlah)
                    : sortedData.sort((a, b) => a.jumlah - b.jumlah);
            }
            setPengeluaran(sortedData);
        } catch (error) {
            console.error("Error fetching pengeluaran:", error);
        }
    };

    const handleSubmitPemasukan = async (e) => {
        e.preventDefault();
        setLoadingPemasukan(true);
        setErrorMessage("");
        try {
            const response = await axios.post("http://localhost:8080/api/tabungan/pemasukan", {
                jumlah: pemasukanData.jumlah,
            });
            setPemasukanData({ jumlah: "" });
            fetchTabungan();
            toast.success("Pemasukan berhasil ditambahkan!");
        } catch (error) {
            console.error("Error adding pemasukan:", error);
            setPemasukanData({ jumlah: "" });
            setErrorMessage(error.response?.data?.errors || "Terjadi kesalahan saat menambahkan pemasukan.");
            toast.error("Gagal menambahkan pemasukan.");
        } finally {
            setLoadingPemasukan(false);
        }
    };

    const handleSubmitPengeluaran = async (e) => {
        e.preventDefault();
        setLoadingPengeluaran(true);
        setErrorMessage("");
        try {
            const response = await axios.post("http://localhost:8080/api/tabungan/pengeluaran", {
                jumlah: pengeluaranData.jumlah,
                tanggal: pengeluaranData.tanggal,
            });
            setPengeluaranData({ jumlah: "", tanggal: "" });
            fetchTabungan();
            fetchPengeluaran();
            toast.success("Pengeluaran berhasil ditambahkan!");
        } catch (error) {
            console.error("Error adding pengeluaran:", error);
            setPengeluaranData({ jumlah: "", tanggal: "" });
            setErrorMessage(error.response?.data?.errors || "Terjadi kesalahan saat menambahkan pengeluaran.");
            toast.error("Gagal menambahkan pengeluaran.");
        } finally {
            setLoadingPengeluaran(false);
        }
    };

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    const changeSortCriteria = (criteria) => {
        setSortCriteria(criteria);
    };

    useEffect(() => {
        fetchTabungan();
        fetchPengeluaran();
    }, [sortCriteria, sortOrder]);

    return (
        <div className="min-h-svh bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

            <motion.header
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 p-6 text-white text-center font-extrabold text-2xl rounded-b-lg shadow-md"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Moneytary App
            </motion.header>

            <div className="mt-6 w-full max-w-4xl px-6">
                {errorMessage && (
                    <motion.div
                        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-lg shadow"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {errorMessage}
                    </motion.div>
                )}

                <motion.div
                    className="bg-white shadow-lg rounded-lg p-6 mb-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <h2 className="text-2xl font-bold text-blue-800 mb-4">Tabungan</h2>
                    {tabungan ? (
                        <p className="text-3xl font-semibold text-green-600">Rp {tabungan.jumlah.toLocaleString()}</p>
                    ) : (
                        <p>Loading...</p>
                    )}
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div
                        className="bg-white shadow-lg rounded-lg p-6"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 className="text-2xl font-bold text-blue-800 mb-4">Tambah Pemasukan</h2>
                        <form onSubmit={handleSubmitPemasukan} className="space-y-4">
                            <input
                                type="number"
                                placeholder="Jumlah"
                                className="w-full p-3 border border-blue-300 rounded-lg focus:ring focus:ring-blue-200"
                                value={pemasukanData.jumlah}
                                onChange={(e) => setPemasukanData({ ...pemasukanData, jumlah: e.target.value })}
                                required
                            />
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-green-400 to-green-500 text-white py-3 rounded-lg hover:from-green-500 hover:to-green-600 focus:ring focus:ring-green-300"
                                disabled={loadingPemasukan}
                            >
                                {loadingPemasukan ? "Submitting..." : "Submit"}
                            </button>
                        </form>
                    </motion.div>

                    <motion.div
                        className="bg-white shadow-lg rounded-lg p-6"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold text-blue-800 mb-4">Tambah Pengeluaran</h2>
                        <form onSubmit={handleSubmitPengeluaran} className="space-y-4">
                            <input
                                type="number"
                                placeholder="Jumlah"
                                className="w-full p-3 border border-blue-300 rounded-lg focus:ring focus:ring-blue-200"
                                value={pengeluaranData.jumlah}
                                onChange={(e) => setPengeluaranData({ ...pengeluaranData, jumlah: e.target.value })}
                                required
                            />
                            <input
                                type="date"
                                className="w-full p-3 border border-blue-300 rounded-lg focus:ring focus:ring-blue-200"
                                value={pengeluaranData.tanggal}
                                onChange={(e) => setPengeluaranData({ ...pengeluaranData, tanggal: e.target.value })}
                                required
                            />
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-red-400 to-red-500 text-white py-3 rounded-lg hover:from-red-500 hover:to-red-600 focus:ring focus:ring-red-300"
                                disabled={loadingPengeluaran}
                            >
                                {loadingPengeluaran ? "Submitting..." : "Submit"}
                            </button>
                        </form>
                    </motion.div>
                </div>

                <motion.div
                    className="bg-white shadow-lg rounded-lg p-6 mt-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <h2 className="text-2xl font-bold text-blue-800 mb-4">Riwayat Pengeluaran</h2>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <span className="text-sm text-gray-500 mr-2">Urutkan berdasarkan:</span>
                            <button
                                onClick={() => changeSortCriteria("tanggal")}
                                className={`text-sm py-1 px-3 rounded-lg ${sortCriteria === "tanggal" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} mr-2`}
                            >
                                Tanggal
                            </button>
                            <button
                                onClick={() => changeSortCriteria("jumlah")}
                                className={`text-sm py-1 px-3 rounded-lg ${sortCriteria === "jumlah" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                            >
                                Jumlah
                            </button>
                        </div>
                        <button
                            onClick={toggleSortOrder}
                            className="text-sm bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300"
                        >
                            {sortOrder === "desc" ? "Terbesar" : "Terkecil"}
                        </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto bg-gray-50 p-4 rounded-lg border border-gray-200">
                        {pengeluaran.length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                                {pengeluaran.map((item, index) => (
                                    <motion.li
                                        key={index}
                                        className="py-4 flex justify-between items-center bg-white shadow-sm rounded-lg p-4 mb-2"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: index * 0.1 }}
                                    >
                                        <span className="text-lg font-semibold text-gray-700">Rp {item.jumlah.toLocaleString()}</span>
                                        <span className="text-sm text-gray-500">{item.tanggal}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-500">Belum ada riwayat pengeluaran.</p>
                        )}
                    </div>
                </motion.div>
            </div>

            <footer className="w-full bg-blue-500 text-white py-4 mt-6 text-center text-sm rounded-t-lg">
                &copy; 2024 Moneytary. All rights reserved.
            </footer>
        </div>
    );
};

export default MoneytaryApp;
