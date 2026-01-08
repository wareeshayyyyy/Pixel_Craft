import { 
  HiDocumentDuplicate,
  HiScissors,
  HiDocumentAdd,
  HiDocumentRemove,
  HiDocumentText,
  HiDocument
} from 'react-icons/hi';
import {
  BsFilePdf,
  BsImages,
  BsFileEarmarkText,
  BsFileEarmarkWord,
  BsFileEarmarkExcel,
  BsFileEarmarkPpt,
  BsFileEarmarkPdf,
  BsFileEarmarkImage,
  BsLockFill,
  BsUnlockFill
} from 'react-icons/bs';
import {
  MdCompression,
  MdOutlineRotate90DegreesCcw,
  MdWaterDrop,
  MdFormatListNumbered,
  MdEdit,
  MdOutlineDescription
} from 'react-icons/md';
import { TbScan, TbReplace } from 'react-icons/tb';
import { AiOutlineFileSearch } from 'react-icons/ai';

const iconStyle = "w-12 h-12";

export const PdfIcons = {
  // PDF Organization
  merge: <HiDocumentDuplicate className={`${iconStyle} text-blue-500`} />,
  split: <HiScissors className={`${iconStyle} text-purple-500`} />,
  removePages: <HiDocumentRemove className={`${iconStyle} text-red-500`} />,
  extractPages: <HiDocumentAdd className={`${iconStyle} text-green-500`} />,
  organize: <HiDocumentText className={`${iconStyle} text-blue-600`} />,
  scan: <TbScan className={`${iconStyle} text-indigo-500`} />,

  // PDF Optimization
  compress: <MdCompression className={`${iconStyle} text-yellow-600`} />,
  repair: <TbReplace className={`${iconStyle} text-orange-500`} />,
  ocr: <AiOutlineFileSearch className={`${iconStyle} text-purple-600`} />,

  // Convert to PDF
  jpgToPdf: <BsFileEarmarkImage className={`${iconStyle} text-pink-500`} />,
  wordToPdf: <BsFileEarmarkWord className={`${iconStyle} text-blue-700`} />,
  pptToPdf: <BsFileEarmarkPpt className={`${iconStyle} text-red-600`} />,
  excelToPdf: <BsFileEarmarkExcel className={`${iconStyle} text-green-700`} />,
  htmlToPdf: <BsFileEarmarkText className={`${iconStyle} text-gray-600`} />,

  // Convert from PDF
  pdfToJpg: <BsImages className={`${iconStyle} text-pink-600`} />,
  pdfToWord: <BsFileEarmarkWord className={`${iconStyle} text-blue-700`} />,
  pdfToPpt: <BsFileEarmarkPpt className={`${iconStyle} text-red-600`} />,
  pdfToExcel: <BsFileEarmarkExcel className={`${iconStyle} text-green-700`} />,
  pdfToPdfA: <BsFilePdf className={`${iconStyle} text-gray-700`} />,

  // Edit PDF
  rotate: <MdOutlineRotate90DegreesCcw className={`${iconStyle} text-cyan-500`} />,
  pageNumbers: <MdFormatListNumbered className={`${iconStyle} text-violet-500`} />,
  watermark: <MdWaterDrop className={`${iconStyle} text-teal-500`} />,
  edit: <MdEdit className={`${iconStyle} text-blue-500`} />,

  // Security
  protect: <BsLockFill className={`${iconStyle} text-red-500`} />,
  unlock: <BsUnlockFill className={`${iconStyle} text-green-500`} />,

  // Document Types
  pdf: <BsFilePdf className={`${iconStyle} text-red-500`} />,
  word: <BsFileEarmarkWord className={`${iconStyle} text-blue-600`} />,
  excel: <BsFileEarmarkExcel className={`${iconStyle} text-green-600`} />,
  ppt: <BsFileEarmarkPpt className={`${iconStyle} text-red-600`} />,
  text: <MdOutlineDescription className={`${iconStyle} text-gray-600`} />,
};
