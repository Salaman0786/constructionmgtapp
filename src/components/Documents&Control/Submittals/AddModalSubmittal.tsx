import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Download, Eye, Trash2, X } from "lucide-react";
import { showError, showSuccess } from "../../../utils/toast";
import axios from "axios";
import {
  useCreateSubmittalsMutation,
  useDeleteSubmittalsFileMutation,
  useGetSubmittalsByIdQuery,
  useGetSubmittalsProjectsQuery,
  useUpdateSubmittalsMutation,
  useUploadSubmittalsMutation,
} from "../../../features/submittals/api/submittalApi";
import Loader from "../../common/Loader";
interface AddEditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string | null; // if present → edit mode
}
const AddModalSubmittal: React.FC<AddEditProjectModalProps> = ({
  isOpen,
  onClose,
  projectId,
}) => {
  const isEdit = Boolean(projectId);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const {
    data: projectsData,
    isLoading: isManagersLoading,
    refetch,
  } = useGetSubmittalsProjectsQuery(undefined);
  const { data: projectDetails, isFetching: isProjectFetching } =
    useGetSubmittalsByIdQuery(projectId!, {
      skip: !isEdit,
    });
  const [updateSubmittals, { isLoading: updating }] =
    useUpdateSubmittalsMutation();
  const [showAllFiles, setShowAllFiles] = useState([]);

  const [form, setForm] = useState({
    projectId: "",
    title: "",
    description: "",
    category: "",
    department: "",
    date: "",
  });
  const [uploadSubmittals, { isLoading }] = useUploadSubmittalsMutation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [createSubmittals, { isLoading: isCreateLoading }] =
    useCreateSubmittalsMutation();

  useEffect(() => {
    if (isEdit && projectDetails?.data) {
      const p = projectDetails.data;
      setForm({
        projectId: p?.project?.id,
        title: p?.title,
        category: p?.category,
        department: p?.department,
        date: p?.date.split("T")[0],
        description: p?.description,
      });
      setShowAllFiles(p?.files);
    }
  }, [projectDetails, isEdit]);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadSubmittals(file).unwrap();
      setShowAllFiles((prev) => [res?.data, ...prev]);
      showSuccess("File uploaded successfully!");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      showError(err?.data?.message || "Upload failed!");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  const downloadFile = async (url: string) => {
    try {
      const response = await fetch(url, {
        mode: "cors",
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;

      // Automatically extract filename from URL
      link.download = url.split("/").pop() || "downloaded-file";

      document.body.appendChild(link);
      link.click();
      link.remove();

      // Cleanup blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };
  const [deleteFile, { isLoading: isDeleteLoading }] =
    useDeleteSubmittalsFileMutation();

  const handleDelete = async (fileId) => {
    try {
      await deleteFile(fileId).unwrap();
      setShowAllFiles((prev) => prev.filter((data) => data.id !== fileId));
      showSuccess("File deleted successfully!!");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };
  const handleSubmit = async () => {
    // const data = JSON.stringify({
    //   projectId: "cd3df544-5164-417b-a9a2-3f518225fbd9",
    //   drawingName: "Final structure2",
    //   discipline: "Electrical",
    //   revision: "R1",
    //   date: "2020-02-15",
    //   description: "completed2",
    //   files: [
    //     {
    //       id: "0e0f4025-a4fd-4091-8cfb-f3b14d4a0e0f",
    //       url: "https://addisababa-store-s3.s3.ap-southeast-1.amazonaws.com/drawing-revisions/db4143a2-6046-4086-8fe6-23184b796b3a-backgroundImage.jpg%22%22",
    //       originalName: "backgroundImage.jpg",
    //     },
    //     {
    //       id: "a21ec3a0-ad7f-4a51-bfde-e483ae65fef5",
    //       url: "https://addisababa-store-s3.s3.ap-southeast-1.amazonaws.com/drawing-revisions/5af9ae5e-d2ec-4c39-8077-6c34a29122f5-Screenshot%20(3).png%22%22",
    //       originalName: "Screenshot (3).png",
    //     },
    //     {
    //       id: "ad841e9f-c1ed-4a7b-8502-8bc5a2eec3a3",
    //       url: "https://addisababa-store-s3.s3.ap-southeast-1.amazonaws.com/drawing-revisions/a2c6b4f3-7327-4b37-a9d5-6a95ea354887-backgroundImage.jpg%22%22",
    //       originalName: "backgroundImage.jpg",
    //     },
    //   ],
    // });

    // const config = {
    //   method: "put",
    //   maxBodyLength: Infinity,
    //   url: "https://construction-api-stg.addisababadbohra.com/api/drawings/0564d651-081f-4328-b978-fdc2c3325f88",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: "••••••",
    //   },
    //   data: data,
    // };

    // axios
    //   .request(config)
    //   .then((response) => {
    //     console.log(JSON.stringify(response.data));
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    const payload = {
      projectId: form.projectId,
      title: form.title,
      category: form.category,
      department: form.department,
      date: form.date,
      description: form.description,
      files: showAllFiles,
    };
    console.log(payload, "allpayloadvaluegot");

    try {
      if (isEdit) {
        await updateSubmittals({ id: projectId, payload }).unwrap();
        showSuccess("Project updated successfully!");
      } else {
        await createSubmittals(payload).unwrap();
        showSuccess("Drawing uploaded successfully!");
      }
      onClose();
      refetch();
      setShowAllFiles([]);
      setForm({
        projectId: "",
        title: "",
        category: "",
        department: "",
        date: "",
        description: "",
      });
      setShowAllFiles([]);
    } catch (error: any) {
      const msg = Array.isArray(error?.data?.message)
        ? error.data.message.join(", ")
        : error?.data?.message;

      showError(msg || "Something went wrong.");
    }
  };
  if (!isOpen) return null;
  const handleClose = () => {
    setForm({
      projectId: "",
      title: "",
      category: "",
      department: "",
      date: "",
      description: "",
    });
    setShowAllFiles([]);
    onClose();
  };
  const handleDownload = async (fileUrl) => {
    try {
      const response = await fetch(fileUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }

      const blob = await response.blob();

      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;

      // Extract file name from URL
      const filename = fileUrl.split("/").pop() || "download";
      a.download = filename;

      a.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download error:", error);
    }
  };
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[350px] sm:max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="w-full max-w-xl mx-auto bg-white">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold mb-4">New Submittal</h2>
            <div onClick={handleClose} className="cursor-pointer text-xl">
              <X />
            </div>
          </div>
          {isProjectFetching ? (
            <Loader />
          ) : (
            <div>
              {/* FORM FIELDS */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Project *
                </label>
                <select
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm"
                  value={form?.projectId}
                  onChange={(e) =>
                    setForm({ ...form, projectId: e.target.value })
                  }
                >
                  <option value="">Select project</option>
                  {projectsData?.data?.projects.map((p) => (
                    <option value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter title"
                  className="w-full mt-1 border border-gray-300 rounded-md p-2"
                  value={form?.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  className="w-full mt-1 border border-gray-300 rounded-md p-2"
                  value={form?.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  <option value="Material">Material</option>
                  <option value="Drawing">Drawing</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Department *
                  </label>
                  <select
                    className="w-full mt-1 border border-gray-300 rounded-md p-2"
                    value={form?.department}
                    onChange={(e) =>
                      setForm({ ...form, department: e.target.value })
                    }
                  >
                    <option value="">Select Department</option>
                    <option value="Structural">Structural</option>
                    <option value="MEP">MEP</option>
                    <option value="Civil">Civil</option>
                    <option value="Safety">Safety</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Date *
                  </label>
                  <input
                    type="date"
                    className="w-full mt-1 border border-gray-300 rounded-md p-2 cursor-pointer"
                    onClick={(e) => {
                      e.currentTarget.showPicker?.(); // ✔ Allowed user gesture
                    }}
                    onKeyDown={(e) => {
                      if (e.key === " ") e.preventDefault(); // disable SPACE opening calendar
                    }}
                    value={form?.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Linked Drawing (Optional)
                </label>
                <select
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm"
                  value={form?.projectId}
                  onChange={(e) =>
                    setForm({ ...form, projectId: e.target.value })
                  }
                >
                  <option value="">Select project</option>
                  {projectsData?.data?.projects.map((p) => (
                    <option value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 h-24"
                  placeholder="Write description here..."
                  value={form?.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                ></textarea>
              </div>

              {/* FILE UPLOAD */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700">
                  Upload Your Submittal File *
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm"
                />
                {isLoading && (
                  <p className="text-sm text-blue-600 mt-1">Uploading...</p>
                )}
              </div>

              {/* FILE LIST */}
              {showAllFiles.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Previous Documents
                  </h3>

                  <div className="space-y-2 bg-gray-50 p-3 rounded-md border text-sm">
                    {showAllFiles.map((doc, index) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-2 bg-white rounded border"
                      >
                        <span>
                          <span className="font-medium mr-2">{index + 1}</span>
                          {doc.originalName}
                        </span>

                        <div className="flex items-center gap-3 text-gray-600 ">
                          <button
                            onClick={() => window.open(doc.url, "_blank")}
                            className="hover:text-blue-400"
                          >
                            <Eye />
                          </button>

                          <button
                            // href={doc.url}
                            // download
                            // target="_blank"
                            onClick={() => handleDownload(doc.url)}
                            className="hover:text-blue-400"
                          >
                            <Download />
                          </button>

                          <button
                            onClick={() => handleDelete(doc.id)}
                            disabled={isDeleteLoading}
                            className="hover:text-blue-400"
                          >
                            <Trash2 />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 border rounded-md text-sm"
                  onClick={handleClose}
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-purple-700 text-white rounded-md text-sm"
                  disabled={isCreateLoading}
                >
                  {/* {isCreateLoading ? "Saving..." : "Upload Drawing"} */}
                  {isEdit
                    ? updating
                      ? "Updating..."
                      : "Update Submittal"
                    : isCreateLoading
                    ? "Saving..."
                    : "Upload Submittal"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddModalSubmittal;

// import React, { useState } from "react";
// import { X, Upload } from "lucide-react";
// import { RequiredLabel } from "../../common/RequiredLabel";

// interface SubmittalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const SubmittalModal: React.FC<SubmittalProps> = ({
//   isOpen,
//   onClose,
// }) => {
//   const [form, setForm] = useState({
//     project: "",
//     title: "",
//     category: "",
//     linkedDrawing: "",
//     department: "",
//     description: "",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >
//   ) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("New Submittal:", form);
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
//       <div className="relative bg-white rounded-xl shadow-lg w-full max-w-[380px] sm:max-w-xl p-6 max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center border-b pb-3">
//           <h2 className="text-base font-semibold text-gray-800">
//             New Submittal
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="mt-4 space-y-4">
//           {/* Select Project */}
//           <div>
//             <RequiredLabel label="Select Project" />
//             <select
//               name="project"
//               value={form.project}
//               onChange={handleChange}
//               required
//               className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
//   focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
//             >
//               <option value="">Choose a project</option>
//               <option value="Project A">Project A</option>
//               <option value="Project B">Project B</option>
//             </select>
//           </div>

//           {/* Title */}
//           <div>
//             <RequiredLabel label="Title" />
//             <input
//               type="text"
//               name="title"
//               value={form.title}
//               onChange={handleChange}
//               placeholder="Enter submittal title"
//               required
//               className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
//   focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
//             />
//           </div>

//           {/* Category */}
//           <div>
//             <RequiredLabel label="Category" />
//             <select
//               name="category"
//               value={form.category}
//               onChange={handleChange}
//               required
//               className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
//   focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
//             >
//               <option value="">Select category</option>
//               <option value="Structural">Structural</option>
//               <option value="Electrical">Electrical</option>
//             </select>
//           </div>

//           {/* Linked Drawing */}
//           <div>
//             <label className="text-sm text-gray-700">
//               Linked Drawing (Optional)
//             </label>
//             <select
//               name="linkedDrawing"
//               value={form.linkedDrawing}
//               onChange={handleChange}
//               className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
//   focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
//             >
//               <option value="">Select a drawing</option>
//               <option value="Drawing A">Drawing A</option>
//             </select>
//           </div>

//           {/* Department */}
//           <div>
//             <RequiredLabel label="Department" />
//             <select
//               name="department"
//               value={form.department}
//               onChange={handleChange}
//               required
//               className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
//   focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
//             >
//               <option value="">Select department</option>
//               <option value="Structural">Structural</option>
//               <option value="Mechanical">Mechanical</option>
//             </select>
//           </div>

//           {/* Description */}
//           <div>
//             <RequiredLabel label="Description" />
//             <textarea
//               name="description"
//               value={form.description}
//               onChange={handleChange}
//               placeholder="Enter detailed description"
//               rows={3}
//               required
//               className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
//   focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
//             />
//           </div>

//           {/* Upload Files */}
//           <div>
//             <RequiredLabel label="Upload Files " />
//             <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
//               <Upload className="mx-auto mb-2 text-gray-500" />
//               <p className="text-xs text-gray-500">
//                 Drag and drop your drawing file here or click to upload
//               </p>
//               <button
//                 type="button"
//                 className="mt-2 px-3 py-1 border rounded text-sm"
//               >
//                 Upload
//               </button>
//             </div>
//           </div>

//           {/* Previous Documents */}
//           {/* <div>
//             <h4 className="text-sm font-medium text-gray-700 mb-2">
//               Previous Documents
//             </h4>
//             <div className="space-y-2">
//               <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
//                 <span className="text-xs">floor-plan-v2.pdf</span>
//                 <div className="flex gap-2">
//                   <button className="text-xs border px-2 py-1 rounded">View File</button>
//                   <button className="text-xs border px-2 py-1 rounded">Download</button>
//                 </div>
//               </div>
//             </div>
//           </div> */}

//           {/* Buttons */}
//           <div className="flex justify-end gap-3 mt-6">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700
//               hover:bg-[#facf6c] hover:border-[#fe9a00]"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               className="px-4 py-2 bg-[#5b00b2] text-white rounded-md text-sm hover:bg-[#4b0082]
//               disabled:opacity-60 disabled:cursor-not-allowed"
//             >
//               Submit
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SubmittalModal;
