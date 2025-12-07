"use client";

import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { BiChevronLeft } from "react-icons/bi";

export default function ComprobantePage() {
    const { id } = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [transaction, setTransaction] = useState(null);

    useEffect(() => {
        if (!id) return;

        const load = async () => {
            setLoading(true);

            const { data, error } = await supabase
                .from("transactions")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                console.error("Error cargando transacción:", error);
                return;
            }

            setTransaction(data);
            setLoading(false);
        };

        load();
    }, [id]);

    if (loading) return <p className="p-6">Cargando comprobante...</p>;
    if (!transaction) return <p className="p-6">No encontrado</p>;

    const goBack = () => router.back();

    return (
        <ProtectedRoute>
            <Navbar />

            <div className="p-6 max-w-xl mx-auto">
                <button
                    onClick={goBack}
                    className="mb-6 flex items-center text-gray-700 hover:text-black transition cursor-pointer"
                >
                    <BiChevronLeft className="w-6 h-6" />
                    <span>Volver</span>
                </button>

                <h1 className="text-3xl font-bold mb-4">Comprobante</h1>

                <div className="p-4 border rounded-lg bg-white shadow">
                    <p><strong>Monto:</strong> S/ {transaction.amount}</p>
                    <p><strong>Estado:</strong> {transaction.status}</p>
                    <p><strong>Últimos 4 dígitos:</strong> {transaction.card_last4}</p>
                    <p><strong>ID Pago Stripe:</strong> {transaction.stripe_payment_id}</p>
                    <p><strong>Fecha:</strong> {new Date(transaction.created_at).toLocaleString()}</p>
                </div>

                <button
                    onClick={() => router.push("/ventas")}
                    className="mt-6 w-full bg-blue-600 text-white p-3 rounded cursor-pointer transition"
                >
                    Volver a ventas
                </button>
            </div>
        </ProtectedRoute>
    );
}