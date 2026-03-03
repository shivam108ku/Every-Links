"use server"

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export const onBoardUser = async()=>{
  try {
    const user = await currentUser()

    if(!user){
      return {
        success:false, error:"Not auth user"
      }
    }

    const {id , firstName , lastName , imageUrl , emailAddresses} = user;

    // user upsert to create and update users
    const newUser = await db.user.upsert({
      where:{
        clerkId:id
      },
      update:{
        firstName:firstName || null,
        lastName:lastName || null,
        imageUrl:imageUrl || null,
        email: emailAddresses[0]?.emailAddress || " ",
      },
      create:{
        clerkId:id,
        firstName:firstName || null,
        lastName:lastName || null,
        imageUrl:imageUrl || null,
        email: emailAddresses[0]?.emailAddress || " ",
      }

    })

    return {
      success:true,
      user: newUser,
      message: "User onboard successfully",
    }

  } catch (error){
    console.log(error);
      return {
      success:false, 
      message: "Failed to onboard user",
    }
  }
}