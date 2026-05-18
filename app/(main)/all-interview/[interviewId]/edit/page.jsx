"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import axios from "axios";
// Adjust these imports based on your ui library setup (e.g., shadcn)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"

export default function EditInterviewPage() {
    const params = useParams();
    const router = useRouter();
    const interviewId = params?.interviewId;

    const [formData, setFormData] = useState({
        jobPosition: "",
        duration: "",
        jobDescription: "",
    });
    const [isFetching, setIsFetching] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState("");

    // Fetch current details to populate form fields
    useEffect(() => {
        if (!interviewId) return;

        const fetchInterviewDetails = async () => {
            try {
                setIsFetching(true);
                // Direct request to your new GET API endpoint
                const response = await axios.get(`/api/interviews/${interviewId}/edit`);
                const data = response.data;

                setFormData({
                    jobPosition: data.jobPosition || "",
                    duration: data.duration || "",
                    jobDescription: data.jobDescription || "",
                });
            } catch (err) {
                console.error("Error loading interview:", err);
                setError("Failed to load interview details.");
            } finally {
                setIsFetching(false);
            }
        };

        fetchInterviewDetails();
    }, [interviewId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setError("");

        try {
            await axios.put(`/api/interviews/${interviewId}/edit`, formData);
            toast.success("Interview updated successfully!");
            router.push(`/all-interview/${interviewId}`);
        } catch (err) {
            console.error("Error updating interview:", err);
            setError(err.response?.data?.message || "Something went wrong while updating.");
            setIsUpdating(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] flex-col gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-sm text-gray-500">Loading details...</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white border rounded-xl shadow-md mt-10">
            {/* Header element */}
            <div className="flex items-center gap-4 border-b pb-4 mb-6">
                <Link href={`/all-interview/${interviewId}`} className="p-2 hover:bg-gray-100 rounded-full transition">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="font-bold text-2xl text-gray-800">Edit Interview Setup</h1>
                    <p className="text-sm text-gray-500">Modify properties for this dynamic template</p>
                </div>
            </div>

            {error && (
                <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                    {error}
                </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Job Position / Role</label>
                    <Input
                        type="text"
                        name="jobPosition"
                        value={formData.jobPosition}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Full Stack Developer"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Duration (e.g., 15 Mins)</label>
                    <Input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                        placeholder="e.g. 20 Mins"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Job Description</label>
                    <Textarea
                        name="jobDescription"
                        rows={6}
                        value={formData.jobDescription}
                        onChange={handleChange}
                        required
                        placeholder="Paste core requirements or summary here..."
                        className="resize-none"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isUpdating}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isUpdating} className="flex gap-2 items-center">
                        {isUpdating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                            </>
                        ) : (
                            <>
                                <Save size={16} /> Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}