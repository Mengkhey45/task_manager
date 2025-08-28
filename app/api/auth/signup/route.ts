"use server"

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const supabase = createClient(cookies());

        const credentials = {
            firstname: formData.get("firstname") as string,
            lastname: formData.get("lastname") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            role: "user",
        };

        const { error, data } = await supabase.auth.signUp({
            email: credentials.email,
            password: credentials.password,
            options: {
                data: {
                    firstname: credentials.firstname,
                    lastname: credentials.lastname,
                    role: credentials.role,
                },
            },
        });

        if (error) {
            return NextResponse.json({ status: error.message, user: null }, { status: 400 });
        }

        if ((data as any)?.user?.identities?.length === 0) {
            return NextResponse.json({ status: "User with this email already exists", user: null }, { status: 409 });
        }

        // revalidate the root layout so UI updates to signed-in state if needed
        try {
            revalidatePath("/");
        } catch (e) {
            // ignore if revalidation isn't applicable
        }

        return NextResponse.json({ status: "success", user: (data as any).user }, { status: 201 });
    } catch (err) {
        console.error("Signup route error:", err);
        return NextResponse.json({ status: "error", message: String(err) }, { status: 500 });
    }
}