import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@/payload.config";

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise });

    // Find the first user in the system to assign data to
    const users = await payload.find({
      collection: "users",
      limit: 1,
    });

    if (users.docs.length === 0) {
      return NextResponse.json({ error: "No users found in database to seed data to." }, { status: 400 });
    }

    const userId = users.docs[0].id;

    console.log("Seeding data for user ID:", userId);

    // 1. Seed Teams
    const team1 = await payload.create({
      collection: "teams",
      data: {
        leader: userId as any,
        competitionName: "Gemastik 2026 - Data Mining",
        fieldCategory: "Data Science",
        projectSynopsis: "Kami akan menganalisis dataset e-commerce menggunakan XGBoost.",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // +7 days
        competitionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 days
        isClosed: false,
      },
    });

    await payload.create({
      collection: "team-vacancies",
      data: {
        team: team1.id as any,
        roleTitle: "Data Engineer",
        skillsRequired: [{ skill: "Python" }, { skill: "SQL" }],
        slotsTotal: 2,
        slotsFilled: 0,
      }
    });

    // 2. Seed Study Tasks
    await payload.create({
      collection: "study-tasks",
      data: {
        user: userId as any,
        title: "Selesaikan Laporan Akhir Basis Data",
        category: "Tugas Kuliah",
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // +3 days
        status: "PENDING",
        checklists: [
          { taskName: "Buat ERD", isCompleted: true },
          { taskName: "Normalisasi Tabel", isCompleted: false },
          { taskName: "Tulis Dokumentasi API", isCompleted: false },
        ]
      }
    });

    await payload.create({
      collection: "study-tasks",
      data: {
        user: userId as any,
        title: "Beli Makan untuk Panitia",
        category: "Organisasi",
        deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: "PENDING",
        checklists: [
          { taskName: "Pesan Nasi Kotak 50 porsi", isCompleted: false },
        ]
      }
    });

    // 3. Seed Campus Gigs (Employer Side)
    // We create another user to act as the "poster"
    const employers = await payload.find({
      collection: "users",
      where: {
        id: { not_equals: userId }
      },
      limit: 1
    });

    let posterId = userId;
    if (employers.docs.length > 0) {
      posterId = employers.docs[0].id;
    }

    await payload.create({
      collection: "gigs",
      data: {
        title: "Desain Logo untuk Startup Kopi",
        description: "Saya butuh desainer handal untuk membuat logo minimalis untuk brand kopi baru bernama 'Kopi Senja'. File vektor wajib diserahkan.",
        category: "Design",
        poster: posterId as any,
        budgetCoins: 500,
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "OPEN",
      }
    });

    await payload.create({
      collection: "gigs",
      data: {
        title: "Bantu Survei Kuisioner Skripsi",
        description: "Butuh 50 responden untuk mengisi kuisioner tentang perilaku belanja online. Yang berhasil dapet akan saya kasih fee.",
        category: "Research",
        poster: posterId as any,
        budgetCoins: 150,
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: "OPEN",
      }
    });

    // 4. Seed Tutors
    await payload.create({
      collection: "tutors",
      data: {
        user: userId as any,
        subject: "Pemrograman Web Lanjut (Next.js & React)",
        hourlyRateCoins: 100,
        isApproved: true,
        linkedInUrl: "https://linkedin.com/in/demouser",
        portfolioUrl: "https://github.com/demouser",
      }
    });

    return NextResponse.json({ message: "Seed data successfully populated!" });
  } catch (error: any) {
    console.error("Failed to seed data:", error);
    return NextResponse.json({ error: String(error), stack: error?.stack }, { status: 500 });
  }
}
