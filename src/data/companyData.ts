import type { CompanyStructure } from '../types';

export const companyData: CompanyStructure = {
    executives: [
        {
            name: "Salaheddine Elyaakoubi",
            role: "General Manager",
            telegram: "@Salaheddine_elyakoubi",
            location: "California (Avenue Banafsaj)"
        },
        {
            name: "Ibrahim EL Maimouni",
            role: "HR Manager",
            telegram: "@Ibrahim_Elmimouni",
            location: "California (Avenue Banafsaj)"
        }
    ],
    locations: [
        {
            id: "california",
            name: "California (Avenue Banafsaj)",
            mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3236.7368258798906!2d-5.8449250237249295!3d35.78184052443994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0c79a01a02e7a7%3A0x3742104ecd03499a!2sTraffic%20loop%20solutions!5e0!3m2!1sen!2sma!4v1746104811818!5m2!1sen!2sma",
            units: [
                {
                    id: "tech",
                    name: "Technician",
                    type: "special",
                    teams: [
                        {
                            id: "tech-team",
                            name: "Technician",
                            members: [
                                { name: "Mohamed Alaoui", role: "Tech Lead", telegram: "+212636203456" }
                            ]
                        }
                    ]
                },
                {
                    id: "offers",
                    name: "Offers Team",
                    type: "special",
                    teams: [
                        {
                            id: "offers-team",
                            name: "Offers",
                            members: [
                                { name: "Bouchra Merroun", role: "Offers", telegram: "@B_chra" },
                                { name: "Oumaima Tial", role: "Offers", telegram: "@Oumayma_tl" }
                            ]
                        }
                    ]
                },
                {
                    id: "security",
                    name: "Security",
                    type: "special",
                    teams: [
                        {
                            id: "security-team",
                            name: "Security",
                            members: [
                                { name: "Abdelmoumen", role: "Security" },
                                { name: "Hamid", role: "Security" }
                            ]
                        }
                    ]
                },
                {
                    id: "cleaning",
                    name: "Cleaning",
                    type: "special",
                    teams: [
                        {
                            id: "cleaning-team",
                            name: "Cleaning",
                            members: [
                                { name: "Mounia", role: "Cleaning" },
                                { name: "Aziza", role: "Cleaning" }
                            ]
                        }
                    ]
                },
                {
                    id: "gml",
                    name: "GML",
                    supervisor: { name: "Hicham Mennour", role: "Supervisor", telegram: "@hichamwork" },
                    teams: [
                        {
                            id: "gml-others",
                            name: "Others Team",
                            members: [
                                { name: "Mohamed Khallouqi", telegram: "@M_med_018" },
                                { name: "Ihab Lamsaadi", telegram: "@ihablams" },
                                { name: "Khalid Touil", telegram: "@koli78" },
                                { name: "Nadir Elabid", telegram: "+212691936017" }
                            ]
                        },
                        {
                            id: "gml-gmail",
                            name: "Gmail Team",
                            members: [
                                { name: "Akram Mlouki", role: "Team Leader", telegram: "Undefined" },
                                { name: "Oumaima El Moussaoui", telegram: "@ELMusauiOumaima" },
                                { name: "Charif Edrissi", telegram: "+212680743979" },
                                { name: "Khalid Mesbah", telegram: "@khaledeeev" },
                                { name: "Imane Laboudi", telegram: "@imane_laboudi" }
                            ]
                        }
                    ]
                },
                {
                    id: "gmk",
                    name: "GMK",
                    supervisor: { name: "Hamza Fellah", role: "Supervisor", telegram: "+212677510391" },
                    teams: [
                        {
                            id: "gmk-hotmail",
                            name: "Hotmail Team",
                            members: [
                                { name: "Marouane Latif", role: "Team Leader", telegram: "@marouanLatif" },
                                { name: "Mhamed Gssayer", telegram: "@Mhagsa" }
                            ]
                        },
                        {
                            id: "gmk-gmail",
                            name: "Gmail Team",
                            members: [
                                { name: "Haitam Oullad Benhammou", role: "Team Leader", telegram: "@haitamouladbenhamou" },
                                { name: "Bouchra S'bai", telegram: "+212698117856" },
                                { name: "Naim Bellali", telegram: "@Theusers212" },
                                { name: "Houda Rossi" },
                                { name: "Firdaous El Harrak", telegram: "@hk_firdaous" },
                                { name: "Nadia Samadi", telegram: "@NadiiaSamadi" },
                                { name: "Yasir Babahammou", telegram: "@babahammouyassir" }
                            ]
                        }
                    ]
                },
                {
                    id: "gm2",
                    name: "GM2",
                    supervisor: { name: "Ismail Semlali", role: "Supervisor", telegram: "@esmaelwork" },
                    teams: [
                        {
                            id: "gm2-inbox",
                            name: "Gmail Inbox",
                            members: [
                                { name: "Mehdi Kazman", role: "Team Leader", telegram: "@mkazmane" }
                            ]
                        }
                    ]
                },
                {
                    id: "gms",
                    name: "GMS",
                    teams: [
                        {
                            id: "gms-spam",
                            name: "Gmail Spam",
                            members: [
                                { name: "Adil Jbilou Mnari", role: "Team Leader", telegram: "@mohammedmnari" },
                                { name: "Ayoub El Mahdi", telegram: "@ayoubelmahdi" },
                                { name: "Halima Es-sebyity", telegram: "@Essebyity" },
                                { name: "Achraf Jebari", telegram: "@achrafmaro" },
                                { name: "Firdaws El Haouzi", telegram: "@firdaw123" },
                                { name: "Adnan Bakkali" },
                                { name: "Soulaimane El Harras" },
                                { name: "Fatima Zahrae Chaoui", telegram: "@chaouiFatimazahrae" },
                                { name: "Meryam Benoualidine", telegram: "@meryam200" }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: "sour-el-maagazine",
            name: "Sour El Maagazine",
            mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3236.787475691114!2d-5.814137823725026!3d35.780596524508454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0c7f142e05ed99%3A0x8c6ad852c8e2742e!2sPI%20Marketing!5e0!3m2!1sen!2sma!4v1746104905595!5m2!1sen!2sma",
            units: [
                {
                    id: "gma",
                    name: "GMA",
                    supervisor: undefined,
                    teams: [
                        {
                            id: 'hatim-yahoo',
                            name: 'Hatim Team - Yahoo',
                            members: [{ name: "Mohamed Stitou", role: "Lead" }]
                        },
                        {
                            id: 'hatim-spam',
                            name: 'Hatim Team - Gmail Spam',
                            members: [
                                { name: "Mehdi Eziyami", role: "Team Leader", telegram: "@mehdiigm" },
                                { name: "Younes Benkirou" },
                                { name: "FatimaZohra Marso" },
                                { name: "Yassine Tahiri" },
                                { name: "Asmae Khalfi" }
                            ]
                        },
                        {
                            id: 'ahmed-others',
                            name: 'Ahmed Team - Others',
                            members: [
                                { name: "Afaf Dahimi" },
                                { name: "Mohamed Farsani" },
                                { name: "Oumaima Maich" }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: "riad-tetouan",
            name: "Riad Tetouan",
            mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1477.0876264023589!2d-5.801125955928066!3d35.77059454517391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0b81ca76fe8ea9%3A0x288e0c1dc391b2d7!2sTangier%20Office%20Center!5e1!3m2!1sen!2sma!4v1746174355291!5m2!1sen!2sma",
            units: [
                {
                    id: "ein",
                    name: "EIN CONSULTING",
                    supervisor: { name: "Mohamed Aoujil", role: "IT Manager", telegram: "@aoujilmed" },
                    teams: [
                        {
                            id: "ein-reporting",
                            name: "Reporting",
                            members: [
                                { name: "Jihane El Moustaid", role: "Manager" },
                                { name: "Hamza Nigriyya" }
                            ]
                        },
                        {
                            id: "ein-support",
                            name: "Support",
                            members: [
                                { name: "Abdellatif Mrini" },
                                { name: "Mohamed Abasidi" },
                                { name: "Abdelhay Amrani" },
                                { name: "Mouad El Mediouni" },
                                { name: "Hafsa M'bital" },
                                { name: "Mohammed Ifri" },
                                { name: "Abdelali Laatamli" },
                                { name: "Ilias Anouar" },
                                { name: "Najoua" },
                                { name: "Karima" }
                            ]
                        },
                        {
                            id: "ein-dev",
                            name: "Development",
                            members: [
                                { name: "Younes Zaidi", role: "Lead Dev" },
                                { name: "Ouarda Taimi" },
                                { name: "Zakariyae Chmaili" }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};
