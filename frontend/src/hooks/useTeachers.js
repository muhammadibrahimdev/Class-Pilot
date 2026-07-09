import { useEffect } from "react";
import { useState } from "react"
import API from "../api/axios";

export const useTeachers = ({ page, limit, sortKey, sortDir, search }) => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTeachers = async () => {
        const controller = new AbortController();

        const params = new URLSearchParams({
            page, limit, sortKey: sortKey || '', sortDir, search
        });

        API.get('/users/teachers', { params, signal: controller.signal })
            .then((response) => {
                // console.log('API response:', response.data);
                setData(response.data.data.teachers ?? []);
                setTotal(response.data.data.total);
                setTotalPages(response.data.data.totalPages);
                setError(null);

            })
            .catch((err) => {
                if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
                    setError(err.message);
                    setData([]);
                }
            })
            .finally(() => {
                setLoading(false);
            });

        //cleanup
        return () => controller.abort();
    }

    useEffect(() => {
        fetchTeachers();
    }, [page, limit, sortKey, sortDir, search]);

    return { data, total, totalPages, loading, error, refetch: fetchTeachers, }
}