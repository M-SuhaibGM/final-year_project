"use client";
import React, { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

// Shadcn UI Imports
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

function DeleteInterviewAction({ interviewId }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await axios.delete(`/api/interviews/${interviewId}`);
            toast.success("Interview deleted successfully");

            // Redirect to the listing page
            router.push("/all-interview");
            // Refresh the server-side data
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete interview");
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    className="text-white bg-red-400 hover:bg-red-700  transition-all"
                >
                    Delete
                    <Trash2 size={18} />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-[20px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        interview record and all associated candidate data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 rounded-xl"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete Interview"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default DeleteInterviewAction;