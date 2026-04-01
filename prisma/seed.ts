import { PrismaClient, Role, ShopCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear all data
  await prisma.coinTransaction.deleteMany();
  await prisma.userPurchase.deleteMany();
  await prisma.shopItem.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.task.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.group.deleteMany();
  await prisma.user.deleteMany();

  const hash = await bcrypt.hash("password123", 10);

  // ==================== USERS ====================
  const admin = await prisma.user.create({
    data: { name: "Admin User", email: "admin@thesisquest.com", password: hash, role: Role.ADMIN },
  });

  const teacher1 = await prisma.user.create({
    data: { name: "Prof. Garcia", email: "garcia@thesisquest.com", password: hash, role: Role.TEACHER },
  });

  const teacher2 = await prisma.user.create({
    data: { name: "Prof. Santos", email: "santos@thesisquest.com", password: hash, role: Role.TEACHER },
  });

  const student1 = await prisma.user.create({
    data: {
      name: "King Miguel Remo", email: "king@thesisquest.com", password: hash,
      role: Role.STUDENT, xp: 150, level: 3, coins: 85, activeTitle: "Data Hunter",
      loginStreak: 5, lastLoginDate: new Date(),
    },
  });

  const student2 = await prisma.user.create({
    data: {
      name: "Zairhyll Cantilang", email: "zairhyll@thesisquest.com", password: hash,
      role: Role.STUDENT, xp: 80, level: 2, coins: 40, loginStreak: 2, lastLoginDate: new Date(),
    },
  });

  const student3 = await prisma.user.create({
    data: {
      name: "Ian Salazar", email: "ian@thesisquest.com", password: hash,
      role: Role.STUDENT, xp: 200, level: 4, coins: 120, activeTitle: "Literature Lord",
      activeFrame: "gold", loginStreak: 7, lastLoginDate: new Date(),
    },
  });

  const student4 = await prisma.user.create({
    data: {
      name: "Maria Cruz", email: "maria@thesisquest.com", password: hash,
      role: Role.STUDENT, xp: 50, level: 1, coins: 15, loginStreak: 1, lastLoginDate: new Date(),
    },
  });

  const student5 = await prisma.user.create({
    data: {
      name: "Juan Dela Cruz", email: "juan@thesisquest.com", password: hash,
      role: Role.STUDENT, xp: 120, level: 2, coins: 60, loginStreak: 3, lastLoginDate: new Date(),
    },
  });

  const student6 = await prisma.user.create({
    data: {
      name: "Ana Reyes", email: "ana@thesisquest.com", password: hash,
      role: Role.STUDENT, xp: 300, level: 5, coins: 250, activeTitle: "Thesis Titan",
      activeFrame: "rainbow", activeIcon: "crown", loginStreak: 12, lastLoginDate: new Date(),
    },
  });

  // ==================== GROUPS ====================
  const group1 = await prisma.group.create({
    data: {
      name: "ThesisQuest Team", section: "STEM 12-A", subject: "Capstone Project",
      teacherId: teacher1.id,
      members: { create: [{ userId: student1.id }, { userId: student2.id }, { userId: student3.id }] },
    },
  });

  const group2 = await prisma.group.create({
    data: {
      name: "Research Alpha", section: "ABM 12-B", subject: "Practical Research 2",
      teacherId: teacher1.id,
      members: { create: [{ userId: student4.id }, { userId: student5.id }, { userId: student6.id }] },
    },
  });

  // ==================== MILESTONES (Group 1) ====================
  const m1 = await prisma.milestone.create({
    data: {
      title: "Chapter 1 - Introduction",
      description: "Background of the Study, Statement of the Problem, Objectives, Scope and Delimitation",
      order: 1, status: "COMPLETED", xpReward: 100, coinReward: 25,
      groupId: group1.id, dueDate: new Date("2026-02-15"),
    },
  });

  const m2 = await prisma.milestone.create({
    data: {
      title: "Chapter 2 - Review of Related Literature",
      description: "Related Studies, Related Literature, Conceptual Framework, Definition of Terms",
      order: 2, status: "IN_PROGRESS", xpReward: 100, coinReward: 25,
      groupId: group1.id, dueDate: new Date("2026-03-01"),
    },
  });

  const m3 = await prisma.milestone.create({
    data: {
      title: "Chapter 3 - Methodology",
      description: "Research Design, Respondents, Data Gathering, Statistical Treatment",
      order: 3, status: "LOCKED", xpReward: 100, coinReward: 25,
      groupId: group1.id, dueDate: new Date("2026-03-15"),
    },
  });

  const m4 = await prisma.milestone.create({
    data: {
      title: "Chapter 4 - Results and Discussion",
      description: "Presentation of Data, Analysis, Interpretation of Findings",
      order: 4, status: "LOCKED", xpReward: 150, coinReward: 30,
      groupId: group1.id, dueDate: new Date("2026-04-01"),
    },
  });

  const m5 = await prisma.milestone.create({
    data: {
      title: "Chapter 5 - Conclusion and Recommendation",
      description: "Summary of Findings, Conclusions, Recommendations",
      order: 5, status: "LOCKED", xpReward: 150, coinReward: 30,
      groupId: group1.id, dueDate: new Date("2026-04-15"),
    },
  });

  const m6 = await prisma.milestone.create({
    data: {
      title: "Final Defense",
      description: "Panel presentation and defense of the complete research paper",
      order: 6, status: "LOCKED", xpReward: 300, coinReward: 50,
      groupId: group1.id, dueDate: new Date("2026-05-01"),
    },
  });

  // ==================== TASKS (Milestone 1 - Completed) ====================
  await prisma.task.createMany({
    data: [
      { title: "Write Background of the Study", description: "Draft the background section with proper citations", status: "APPROVED", xpReward: 20, coinReward: 10, milestoneId: m1.id, assignedToId: student1.id },
      { title: "Define Statement of the Problem", description: "Formulate the main problem and sub-problems", status: "APPROVED", xpReward: 20, coinReward: 10, milestoneId: m1.id, assignedToId: student2.id },
      { title: "Write Scope and Delimitation", description: "Define the boundaries of the study", status: "APPROVED", xpReward: 15, coinReward: 8, milestoneId: m1.id, assignedToId: student3.id },
      { title: "Finalize Research Objectives", description: "General and specific objectives", status: "APPROVED", xpReward: 15, coinReward: 8, milestoneId: m1.id, assignedToId: student1.id },
    ],
  });

  // ==================== TASKS (Milestone 2 - In Progress) ====================
  const task2a = await prisma.task.create({
    data: { title: "Gather Related Literature", description: "Find at least 10 related literature sources", status: "APPROVED", xpReward: 20, coinReward: 10, milestoneId: m2.id, assignedToId: student1.id },
  });

  const task2b = await prisma.task.create({
    data: { title: "Gather Related Studies", description: "Find at least 10 related studies (local and foreign)", status: "SUBMITTED", xpReward: 20, coinReward: 10, milestoneId: m2.id, assignedToId: student2.id },
  });

  await prisma.task.create({
    data: { title: "Create Conceptual Framework", description: "Design the IPO or research paradigm diagram", status: "IN_PROGRESS", xpReward: 25, coinReward: 12, milestoneId: m2.id, assignedToId: student3.id },
  });

  await prisma.task.create({
    data: { title: "Write Definition of Terms", description: "Define technical and operational terms used in the study", status: "TODO", xpReward: 10, coinReward: 5, milestoneId: m2.id, assignedToId: student1.id },
  });

  // ==================== FEEDBACK ====================
  await prisma.feedback.create({
    data: { content: "Great work on the related literature! Make sure all sources are from 2020 onwards. Approved.", type: "APPROVAL", taskId: task2a.id, teacherId: teacher1.id },
  });

  await prisma.feedback.create({
    data: { content: "Good progress but please add more local studies. At least 5 local and 5 foreign studies are needed.", type: "REVISION_REQUEST", taskId: task2b.id, teacherId: teacher1.id },
  });

  // ==================== MILESTONES (Group 2) ====================
  await prisma.milestone.create({
    data: { title: "Chapter 1 - Introduction", description: "Background, Problem Statement, Objectives", order: 1, status: "IN_PROGRESS", xpReward: 100, coinReward: 25, groupId: group2.id, dueDate: new Date("2026-02-20") },
  });

  await prisma.milestone.create({
    data: { title: "Chapter 2 - Review of Related Literature", description: "Literature Review and Conceptual Framework", order: 2, status: "LOCKED", xpReward: 100, coinReward: 25, groupId: group2.id, dueDate: new Date("2026-03-10") },
  });

  // ==================== ACHIEVEMENTS ====================
  const achievements = await prisma.achievement.createManyAndReturn({
    data: [
      { title: "First Steps", description: "Complete your first task", icon: "footprints", xpRequired: 0, coinReward: 10, condition: "COMPLETE_1_TASK" },
      { title: "On a Roll", description: "Complete 5 tasks", icon: "flame", xpRequired: 50, coinReward: 15, condition: "COMPLETE_5_TASKS" },
      { title: "Milestone Master", description: "Complete your first milestone", icon: "trophy", xpRequired: 100, coinReward: 25, condition: "COMPLETE_1_MILESTONE" },
      { title: "Speed Runner", description: "Complete a task before its due date", icon: "zap", xpRequired: 0, coinReward: 15, condition: "EARLY_COMPLETION" },
      { title: "Perfect Score", description: "Get a task approved on first submission", icon: "star", xpRequired: 0, coinReward: 20, condition: "FIRST_TRY_APPROVAL" },
      { title: "Scholar", description: "Reach Level 5", icon: "graduation-cap", xpRequired: 250, coinReward: 30, condition: "REACH_LEVEL_5" },
      { title: "Research Champion", description: "Reach Level 10", icon: "crown", xpRequired: 500, coinReward: 50, condition: "REACH_LEVEL_10" },
      { title: "Streak Master", description: "Maintain a 7-day login streak", icon: "fire", xpRequired: 0, coinReward: 20, condition: "LOGIN_STREAK_7" },
      { title: "Big Spender", description: "Purchase 5 items from the shop", icon: "shopping-bag", xpRequired: 0, coinReward: 15, condition: "PURCHASE_5_ITEMS" },
      { title: "Collector", description: "Own 3 different titles", icon: "bookmark", xpRequired: 0, coinReward: 25, condition: "OWN_3_TITLES" },
    ],
  });

  await prisma.userAchievement.createMany({
    data: [
      { userId: student1.id, achievementId: achievements[0].id },
      { userId: student1.id, achievementId: achievements[1].id },
      { userId: student1.id, achievementId: achievements[2].id },
      { userId: student2.id, achievementId: achievements[0].id },
      { userId: student3.id, achievementId: achievements[0].id },
      { userId: student3.id, achievementId: achievements[1].id },
      { userId: student3.id, achievementId: achievements[2].id },
      { userId: student3.id, achievementId: achievements[3].id },
      { userId: student6.id, achievementId: achievements[0].id },
      { userId: student6.id, achievementId: achievements[1].id },
      { userId: student6.id, achievementId: achievements[2].id },
      { userId: student6.id, achievementId: achievements[3].id },
      { userId: student6.id, achievementId: achievements[4].id },
      { userId: student6.id, achievementId: achievements[5].id },
      { userId: student6.id, achievementId: achievements[7].id },
    ],
  });

  // ==================== SHOP ITEMS ====================
  await prisma.shopItem.createMany({
    data: [
      // Titles
      { name: "Research Rookie", description: "A humble beginning for every researcher", category: ShopCategory.TITLE, price: 20, icon: "scroll", rarity: "common", preview: "Research Rookie" },
      { name: "Data Hunter", description: "You hunt data like no other", category: ShopCategory.TITLE, price: 50, icon: "crosshair", rarity: "uncommon", preview: "Data Hunter" },
      { name: "Literature Lord", description: "Master of the literature review", category: ShopCategory.TITLE, price: 75, icon: "book-open", rarity: "uncommon", preview: "Literature Lord" },
      { name: "Methodology Master", description: "Your research methods are flawless", category: ShopCategory.TITLE, price: 100, icon: "flask-conical", rarity: "rare", preview: "Methodology Master" },
      { name: "Thesis Titan", description: "A formidable force in research", category: ShopCategory.TITLE, price: 150, icon: "shield", rarity: "rare", preview: "Thesis Titan" },
      { name: "Defense Champion", description: "You conquered the final defense", category: ShopCategory.TITLE, price: 200, icon: "swords", rarity: "epic", preview: "Defense Champion" },
      { name: "Research Legend", description: "The ultimate research title. Legendary status.", category: ShopCategory.TITLE, price: 500, icon: "crown", rarity: "legendary", preview: "Research Legend" },

      // Frames
      { name: "Cyan Frame", description: "A sleek cyan border for your profile", category: ShopCategory.FRAME, price: 30, icon: "square", rarity: "common", preview: "cyan" },
      { name: "Magenta Frame", description: "A vibrant magenta border", category: ShopCategory.FRAME, price: 30, icon: "square", rarity: "common", preview: "magenta" },
      { name: "Gold Frame", description: "A prestigious golden border", category: ShopCategory.FRAME, price: 50, icon: "square", rarity: "uncommon", preview: "gold" },
      { name: "Emerald Frame", description: "A calming emerald border", category: ShopCategory.FRAME, price: 50, icon: "square", rarity: "uncommon", preview: "emerald" },
      { name: "Rainbow Frame", description: "An animated rainbow border that shifts colors", category: ShopCategory.FRAME, price: 150, icon: "rainbow", rarity: "epic", preview: "rainbow" },
      { name: "Diamond Frame", description: "The most exclusive frame. Pure brilliance.", category: ShopCategory.FRAME, price: 300, icon: "diamond", rarity: "legendary", preview: "diamond" },

      // Icons
      { name: "Flame Icon", description: "Show everyone you're on fire", category: ShopCategory.ICON, price: 25, icon: "flame", rarity: "common", preview: "flame" },
      { name: "Lightning Icon", description: "Fast and electrifying", category: ShopCategory.ICON, price: 25, icon: "zap", rarity: "common", preview: "zap" },
      { name: "Sword Icon", description: "Ready for battle", category: ShopCategory.ICON, price: 40, icon: "sword", rarity: "uncommon", preview: "sword" },
      { name: "Crown Icon", description: "Royalty in research", category: ShopCategory.ICON, price: 75, icon: "crown", rarity: "rare", preview: "crown" },
      { name: "Dragon Icon", description: "Unleash your inner dragon", category: ShopCategory.ICON, price: 100, icon: "dragon", rarity: "rare", preview: "dragon" },
      { name: "Phoenix Icon", description: "Rise from the ashes of revision", category: ShopCategory.ICON, price: 200, icon: "bird", rarity: "epic", preview: "phoenix" },

      // Flair
      { name: "Sparkle Effect", description: "Add sparkles next to your name on the leaderboard", category: ShopCategory.FLAIR, price: 40, icon: "sparkles", rarity: "uncommon", preview: "sparkle" },
      { name: "Fire Trail", description: "Leave a trail of fire on the leaderboard", category: ShopCategory.FLAIR, price: 80, icon: "flame", rarity: "rare", preview: "fire" },
      { name: "Star Burst", description: "Stars burst around your leaderboard entry", category: ShopCategory.FLAIR, price: 120, icon: "star", rarity: "epic", preview: "starburst" },
    ],
  });

  // Give some purchases to students
  const shopItems = await prisma.shopItem.findMany();
  const dataHunterItem = shopItems.find((i) => i.name === "Data Hunter");
  const litLordItem = shopItems.find((i) => i.name === "Literature Lord");
  const thesisTitanItem = shopItems.find((i) => i.name === "Thesis Titan");
  const cyanFrameItem = shopItems.find((i) => i.name === "Cyan Frame");
  const goldFrameItem = shopItems.find((i) => i.name === "Gold Frame");
  const rainbowFrameItem = shopItems.find((i) => i.name === "Rainbow Frame");
  const crownIconItem = shopItems.find((i) => i.name === "Crown Icon");
  const flameIconItem = shopItems.find((i) => i.name === "Flame Icon");

  if (dataHunterItem) {
    await prisma.userPurchase.create({ data: { userId: student1.id, shopItemId: dataHunterItem.id } });
  }
  if (cyanFrameItem) {
    await prisma.userPurchase.create({ data: { userId: student1.id, shopItemId: cyanFrameItem.id } });
  }
  if (litLordItem) {
    await prisma.userPurchase.create({ data: { userId: student3.id, shopItemId: litLordItem.id } });
  }
  if (goldFrameItem) {
    await prisma.userPurchase.create({ data: { userId: student3.id, shopItemId: goldFrameItem.id } });
  }
  if (thesisTitanItem) {
    await prisma.userPurchase.create({ data: { userId: student6.id, shopItemId: thesisTitanItem.id } });
  }
  if (rainbowFrameItem) {
    await prisma.userPurchase.create({ data: { userId: student6.id, shopItemId: rainbowFrameItem.id } });
  }
  if (crownIconItem) {
    await prisma.userPurchase.create({ data: { userId: student6.id, shopItemId: crownIconItem.id } });
  }
  if (flameIconItem) {
    await prisma.userPurchase.create({ data: { userId: student6.id, shopItemId: flameIconItem.id } });
  }

  // Coin transaction history
  await prisma.coinTransaction.createMany({
    data: [
      { userId: student1.id, amount: 10, reason: "Task approved: Write Background of the Study" },
      { userId: student1.id, amount: 10, reason: "Task approved: Finalize Research Objectives" },
      { userId: student1.id, amount: 25, reason: "Milestone completed: Chapter 1" },
      { userId: student1.id, amount: 10, reason: "Task approved: Gather Related Literature" },
      { userId: student1.id, amount: 5, reason: "Early submission bonus" },
      { userId: student1.id, amount: 10, reason: "Achievement unlocked: First Steps" },
      { userId: student1.id, amount: 15, reason: "Achievement unlocked: On a Roll" },
      { userId: student1.id, amount: -50, reason: "Purchased: Data Hunter (Title)" },
      { userId: student1.id, amount: -30, reason: "Purchased: Cyan Frame" },
      { userId: student3.id, amount: 120, reason: "Various task completions" },
      { userId: student3.id, amount: -75, reason: "Purchased: Literature Lord (Title)" },
      { userId: student3.id, amount: -50, reason: "Purchased: Gold Frame" },
      { userId: student6.id, amount: 350, reason: "Various task completions and achievements" },
      { userId: student6.id, amount: -150, reason: "Purchased: Thesis Titan (Title)" },
      { userId: student6.id, amount: -150, reason: "Purchased: Rainbow Frame" },
      { userId: student6.id, amount: -75, reason: "Purchased: Crown Icon" },
    ],
  });

  // Notifications
  await prisma.notification.createMany({
    data: [
      { userId: student1.id, message: "Prof. Garcia approved your task: Gather Related Literature. +20 XP, +10 QC!", read: false },
      { userId: student2.id, message: "Prof. Garcia requested revisions on: Gather Related Studies.", read: false },
      { userId: student1.id, message: "You unlocked the achievement: Milestone Master! 🏆 +25 QC", read: true },
      { userId: student3.id, message: "New milestone unlocked: Chapter 2 - Review of Related Literature", read: false },
      { userId: student1.id, message: "Reminder: Chapter 2 deadline is approaching (March 1, 2026)", read: false },
      { userId: student1.id, message: "🛒 New items available in the Quest Shop! Check them out.", read: false },
    ],
  });

  console.log("✅ Seed data created successfully!");
  console.log("");
  console.log("📧 Test Accounts (password: password123):");
  console.log("   Admin:   admin@thesisquest.com");
  console.log("   Teacher: garcia@thesisquest.com");
  console.log("   Teacher: santos@thesisquest.com");
  console.log("   Student: king@thesisquest.com     (85 QC, Title: Data Hunter)");
  console.log("   Student: zairhyll@thesisquest.com  (40 QC)");
  console.log("   Student: ian@thesisquest.com       (120 QC, Title: Literature Lord)");
  console.log("   Student: maria@thesisquest.com     (15 QC)");
  console.log("   Student: juan@thesisquest.com      (60 QC)");
  console.log("   Student: ana@thesisquest.com       (250 QC, Title: Thesis Titan)");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });