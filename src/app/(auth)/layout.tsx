'use client'
import { Inter } from "next/font/google";
import { GolangIcon } from "@/assets";
import Image from "next/image";
import { motion } from "framer-motion";

const inter = Inter({ subsets: ["latin"] });

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
      <div className="flex flex-col md:flex-row h-screen w-screen md:overflow-hidden">
      <motion.div 
        className="flex flex-col items-center justify-center bg-primary w-full md:w-1/2 h-1/2 md:h-full"
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: "0", opacity: 1 }}
        transition={{ duration: 1 }}
        >
        <Image src={GolangIcon} alt="Logo" className="w-72 hidden md:block"/>
        <h1 className="text-4xl font-bold text-white mt-4 md:mt-0">
          Go Message
        </h1>
      </motion.div>
      <motion.div className="flex flex-col justify-center items-center bg-white w-full md:w-1/2 h-1/2 md:h-full"
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: "0", opacity: 1 }}
        transition={{ duration: 1 }}
        >
        {children}
      </motion.div>
      </div>
      </body>
    </html>
  );
}
