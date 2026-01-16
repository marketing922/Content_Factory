
export type Language = 'fr' | 'en' | 'zh';

export const translations = {
  fr: {
    common: {
      save: "Enregistrer",
      cancel: "Annuler",
      loading: "Chargement...",
      error: "Une erreur est survenue",
      success: "Succès !",
      delete: "Supprimer",
      edit: "Modifier",
      back: "Retour",
      next: "Suivant",
      finish: "Terminer",
      french: "Français",
      english: "Anglais",
      chinese: "Chinois",
    },
    nav: {
      dashboard: "Tableau de bord",
      library: "Bibliothèque",
      factory: "Content Factory",
      settings: "Paramètres",
      faq: "Centre d'aide",
      logout: "Déconnexion",
      admin: "Administrateur",
      menuLabel: "Menu",
      application: "Application",
    },
    home: {
      welcome: "Bonjour,",
      welcomeDesc: "Prêt à créer votre prochain contenu viral ?",
      createArticle: "Créer un article",
      keywordPlaceholder: "Entrez un mot-clé ou un sujet...",
      optionsTitle: "Options de génération",
      tone: "Tonalité",
      length: "Longueur",
      language: "Langue de rédaction",
      generate: "Générer le plan",
      tones: {
        professional: "Professionnel",
        creative: "Créatif",
        informative: "Informatif",
        humorous: "Humoristique",
      },
      lengths: {
        short: "Court (~500 mots)",
        medium: "Moyen (~1200 mots)",
        long: "Long (+2000 mots)",
      }
    },
    dashboard: {
      title: "Tableau de bord",
      generateBtn: "Générer un article",
      stats: {
        articles: "Articles Générés",
        totalDesc: "Total sur la plateforme",
        avgScore: "Score Moyen",
        avgDesc: "Qualité moyenne",
        waiting: "En Attente",
        waitingDesc: "Nécessitent une validation",
      },
      recent: {
        title: "Récents",
        noArticles: "Aucun article pour le moment.",
        open: "Ouvrir",
      }
    },
    settings: {
      title: "Paramètres",
      desc: "Personnalisez votre expérience et gérez vos préférences système.",
      tabs: {
        profile: "Profil",
        preferences: "Préférences",
        tokens: "Consommation",
        security: "Sécurité",
      },
      profile: {
        title: "Profil Utilisateur",
        desc: "Mettez à jour vos informations publiques.",
        nameLabel: "Nom complet",
        emailLabel: "Email Professionnel",
        emailDesc: "L'email professionnel ne peut pas être modifié.",
      },
      appearance: {
        title: "Interface & Apparence",
        desc: "Personnalisez le look de votre Content Factory.",
        themeTitle: "Thème visuel",
        themes: {
          light: "Clair",
          dark: "Sombre",
          system: "Auto",
        },
        langTitle: "Langue de l'interface",
        langDesc: "Détermine la langue des menus et boutons.",
        notifTitle: "Notifications intelligentes",
        notifDesc: "Recevez une alerte quand l'IA termine une tâche complexe.",
      },
      usage: {
        title: "Consommation & Quotas",
        desc: "Suivi détaillé de vos ressources IA.",
        total: "Consommation totale détectée",
        tokens: "tokens",
        plan: "Plan Optimal",
        research: "Recherche Web & Structuration",
        writing: "Rédaction & Polissage Créatif",
        eval: "Vérification Factuelle & Score",
        note: "Note technique: La consommation est calculée sur la base du modèle Gemini 2.5 Pro. Les opérations secondaires utilisent Gemini 2.5 Flash et Flash Lite.",
      },
      security: {
        title: "Sécurité du Compte",
        desc: "Gérez vos identifiants et l'authentification.",
        newPass: "Nouveau mot de passe",
        confirmPass: "Confirmer le mot de passe",
        updateBtn: "Mettre à jour le mot de passe",
      }
    },
    faq: {
      title: "Une question = Un réponse",
      desc: "Découvrez toutes les fonctionnalités de Content Factory.",
      searchPlaceholder: "Rechercher une fonctionnalité...",
      categories: {
        generation: "Génération d'Articles",
        edition: "Édition & Personnalisation",
        language: "Langues & Support",
        security: "Sécurité & Organisation",
      },
      helpCards: {
        guide: "Guide Avancé",
        guideDesc: "Apprenez à maîtriser les prompts pour obtenir des articles toujours plus précis.",
        guideBtn: "Lire le guide",
        video: "Tutoriel Vidéo",
        videoDesc: "2 minutes pour comprendre comment générer son premier article optimisé SEO.",
        videoBtn: "Voir la vidéo",
      },
      data: [
        {
          category: "Génération d'Articles",
          questions: [
            {
              q: "Comment fonctionne précisément la Content Factory ?",
              a: "Notre système repose sur une architecture multi-agents orchestrée. Un premier agent (Recherche) utilise Tavily pour explorer le web. Un second (Planificateur) structure le sujet. Un troisième (Rédaction) génère le contenu, suivi d'un agent d'Optimisation pour le ton humain et d'un agent d'Évaluation qui score la qualité SEO, la véracité et la lisibilité."
            },
            {
              q: "Quels modèles d'IA alimentent le système ?",
              a: "Nous exploitons la puissance de Google Gemini (2.5 Pro, Flash et Flash Lite) via Vertex AI. Ces modèles sont choisis pour leur fenêtre contextuelle massive et leur capacité de raisonnement supérieure, garantissant des articles de plus de 2000 mots avec une cohérence parfaite."
            },
            {
              q: "Comment est assurée la conformité médicale (TCM) ?",
              a: "Le système intègre un glossaire exhaustif de la pharmacopée chinoise (Ginseng, Astragale, etc.) et les guidelines du Laboratoire Calebasse. Chaque génération respecte les allégations autorisées par le règlement UE 432/2012 pour les compléments alimentaires."
            }
          ]
        },
        {
          category: "Édition & Personnalisation",
          questions: [
            {
              q: "Puis-je modifier la structure générée ?",
              a: "Absolument. La Content Factory propose une étape de validation du sommaire (TOC). Vous pouvez renommer les sections, changer l'ordre ou demander à l'IA de régénérer un axe spécifique avant la rédaction finale."
            },
            {
              q: "Où sont exportés mes articles ?",
              a: "Une fois validés, vos articles sont automatiquement convertis en documents Google Docs et téléchargés sur le dossier Drive partagé de l'organisation, prêts pour la publication."
            },
            {
              q: "Qu'est-ce que le 'Score d'Évaluation' ?",
              a: "Chaque article reçoit une note sur 100 basée sur 5 critères : SEO, Clarté, Véracité, Anti-Plagiat et Ton Humain. Un score inférieur à 80 déclenche automatiquement un cycle d'optimisation supplémentaire par nos agents."
            }
          ]
        },
        {
          category: "Langues & Support",
          questions: [
            {
              q: "Quelles langues sont supportées nativement ?",
              a: "Nous supportons actuellement le Français, l'Anglais et le Chinois (Mandarin). La traduction est intégrale et conserve la précision terminologique de la Médecine Traditionnelle Chinoise."
            }
          ]
        },
        {
          category: "Sécurité & Organisation",
          questions: [
            {
              q: "Qui a accès à cet outil ?",
              a: "L'accès est strictement réservé aux membres de Calebasse possédant un email @calebasse.com. Vos recherches et contenus sont isolés et protégés au sein de notre infrastructure cloud privée."
            }
          ]
        }
      ],
      noResults: "Aucun résultat trouvé pour"
    },
    library: {
      title: "Bibliothèque",
      desc: "Gérez vos contenus générés et publiés.",
      searchPlaceholder: "Rechercher...",
      emptyState: "Aucun article trouvé. Commencez par en générer un !",
      table: {
        title: "Titre",
        lang: "Langue",
        status: "Statut",
        score: "Score",
        date: "Date",
        actions: "Actions",
      },
      status: {
        completed: "Terminé",
        waiting: "Validation requise",
        inProgress: "En cours",
        draft: "Brouillon",
      },
      actions: {
        open: "Ouvrir",
        delete: "Supprimer",
        confirmDelete: "Voulez-vous vraiment supprimer cet article ?",
      }
    },
    factory: {
      title: "Créer un nouvel article",
      desc: "Définissez votre sujet et laissez l'IA rédiger du contenu de qualité pour vous.",
      settingsTitle: "Paramètres de rédaction",
      promptPlaceholder: "Commencez à décrire votre article ici... (Sujet, angle, mots-clés, structure souhaitée)",
      markdown: "Markdown supporté",
      charCount: "caractères",
      docsTitle: "Documents de référence (Optionnel)",
      docsDesc: "Ajouter des fichiers contextuels",
      dragDrop: "Glissez-déposez ou cliquez (PDF, DOCX)",
      footer: {
        cancel: "Annuler",
        ready: "Prêt à rédiger ?",
        generating: "Rédaction en cours...",
        generate: "Générer",
      }
    },
    article: {
      tabs: {
        plan: "Structure du Plan",
        content: "Article",
      },
      status: {
        loading: "Chargement...",
        researching: "Recherches en cours...",
        generatingPlan: "L'IA restructure le plan...",
        writing: "L'IA rédige votre article...",
        translating: "Traduction intelligente...",
        finalizing: "Article finalisé !",
        ready: "Structure du plan prête !",
      },
      header: {
        back: "Retour au tableau de bord",
        version: {
          fr: "Version Française",
          en: "Version Anglaise",
          zh: "Version Chinoise",
        },
        history: "Historique",
        regenerate: "Régénérer",
        save: "Sauvegarder",
        exportDocx: "Télécharger .docx",
        exportPdf: "Télécharger .pdf",
        saveDrive: "Sauvegarder sur Drive",
      },
      editor: {
        placeholder: "Aucun contenu généré pour le moment",
        assistant: {
          title: "Assistant de Rédaction Évolué",
          desc: "Demandez à l'IA d'ajuster le ton, d'approfondir un point ou de reformuler une section.",
          placeholder: "Ex: 'Rends le ton plus journalistique' ou 'Ajoute des détails sur le Ginseng'...",
          send: "Envoyer",
          estimated: "Temps estimé : ~2 minutes",
          validation: "Confirmer et Lancer la rédaction",
        }
      },
      metadata: {
        title: "Statut & Date",
        config: "Configuration",
        tokens: "Consommation (Tokens)",
        id: "ID Unique",
        date: "Date",
        time: "Heure",
        status: "Statut",
        tone: "Ton",
        language: "Langue",
        length: "Longueur",
        words: "Mots",
        wordsUnit: "mots",
      },
      quality: {
        title: "Qualité Globale",
        excellent: "Excellent",
        toImprove: "À améliorer",
        totalScore: "Score Global",
        scoreOutOf: "sur 100",
        criteriaFallback: "Détails d'évaluation en cours de chargement ou non disponibles pour cet article.",
        waitingEval: "En attente d'évaluation...",
        feedbackTitle: "Amélioration",
        feedbackBadge: "Conseils",
        criterion: "Critère",
      },
      research: {
        title: "Laboratoire d'Analyse IA",
        desc: "Synthèse exhaustive des sources et orientations stratégiques",
        synthesisTitle: "Synthèse Labo",
        serpTitle: "Recherches effectuées sur le Web",
        statsTitle: "Données & Chiffres clés",
        pointsTitle: "Points d'attention",
        anglesTitle: "Angles de rédaction recommandés",
        faqTitle: "Questions fréquentes (FAQ)",
        seoTitle: "Stratégie Sémantique & SEO",
        conceptsTitle: "Concepts majeurs",
        relatedTitle: "Termes connexes",
        previewTitle: "Aperçu du Plan de Travail (TOC)",
        suggestedTitle: "Titre suggéré",
        sourceMapTitle: "Cartographie des Sources",
        expert: "Expert",
        reliable: "Fiable",
        standard: "Standard",
        publishedOn: "Publié le",
        noSources: "Aucune source listée spécifiquement.",
        noData: "Aucune donnée de recherche",
        searchMore: "Utilisez la barre ci-dessus pour lancer une analyse ou attendez la synthèse initiale.",
        corrupted: "Données de recherche corrompues ou illisibles.",
      },
      toc: {
        chooseAxis: "Choisissez un autre axe de rédaction",
        regenerateBtn: "Générer un plan avec ce choix",
        generatingStatus: "Génération en cours...",
        chooseTitle: "Choisissez un autre titre",
        assistantTitle: "Éditeur Assistant (Structure)",
        placeholder: "Ex: 'Ajoute une partie sur...', 'Change l'angle pour...'",
        confirmRegen: "Cela générera une toute nouvelle structure liée à cet axe de rédaction.",
        planValidated: "Plan Validé",
        deleteConfirm: "Supprimer cette partie ?",
        selectedBadge: "Sélectionné",
        fileSizeError: "Fichier trop volumineux (max 5MB)",
        regenInfo: "Demande de régénération envoyée...",
        useThisTitle: "Utilise ce titre : ",
        sectionLabel: "Section : ",
        sectionIncluding: " (incluant sous-parties : ",
        modifyLabel: "Modifie la ",
        regardingLabel: "Concernant la ",
      }
    }
  },
  en: {
    common: {
      save: "Save",
      cancel: "Cancel",
      loading: "Loading...",
      error: "An error occurred",
      success: "Success!",
      delete: "Delete",
      edit: "Edit",
      back: "Back",
      next: "Next",
      finish: "Finish",
      french: "French",
      english: "English",
      chinese: "Chinese",
    },
    nav: {
      dashboard: "Dashboard",
      library: "Library",
      factory: "Content Factory",
      settings: "Settings",
      faq: "Help Center",
      logout: "Logout",
      admin: "Administrator",
      menuLabel: "Menu",
      application: "Application",
    },
    home: {
      welcome: "Hello,",
      welcomeDesc: "Ready to create your next viral content?",
      createArticle: "Create an article",
      keywordPlaceholder: "Enter a keyword or topic...",
      optionsTitle: "Generation Options",
      tone: "Tone",
      length: "Length",
      language: "Writing Language",
      generate: "Generate Plan",
      tones: {
        professional: "Professional",
        creative: "Creative",
        informative: "Informative",
        humorous: "Humorous",
      },
      lengths: {
        short: "Short (~500 words)",
        medium: "Medium (~1200 words)",
        long: "Long (+2000 words)",
      }
    },
    dashboard: {
      title: "Dashboard",
      generateBtn: "Generate Article",
      stats: {
        articles: "Articles Generated",
        totalDesc: "Total on platform",
        avgScore: "Average Score",
        avgDesc: "Average quality",
        waiting: "Waiting",
        waitingDesc: "Need validation",
      },
      recent: {
        title: "Recent",
        noArticles: "No articles yet.",
        open: "Open",
      }
    },
    settings: {
      title: "Settings",
      desc: "Customize your experience and manage system preferences.",
      tabs: {
        profile: "Profile",
        preferences: "Preferences",
        tokens: "Consumption",
        security: "Security",
      },
      profile: {
        title: "User Profile",
        desc: "Update your public information.",
        nameLabel: "Full Name",
        emailLabel: "Work Email",
        emailDesc: "Work email cannot be changed.",
      },
      appearance: {
        title: "Interface & Appearance",
        desc: "Personalize the look of your Content Factory.",
        themeTitle: "Visual Theme",
        themes: {
          light: "Light",
          dark: "Dark",
          system: "Auto",
        },
        langTitle: "Interface Language",
        langDesc: "Determines the language of menus and buttons.",
        notifTitle: "Smart Notifications",
        notifDesc: "Get an alert when AI finishes a complex task.",
      },
      usage: {
        title: "Consumption & Quotas",
        desc: "Detailed tracking of your AI resources.",
        total: "Total detected consumption",
        tokens: "tokens",
        plan: "Optimal Plan",
        research: "Web Research & Structuring",
        writing: "Writing & Creative Polishing",
        eval: "Fact Checking & Score",
        note: "Technical Note: Consumption is calculated based on Gemini 2.5 Pro. Secondary operations use Gemini 2.5 Flash and Flash Lite.",
      },
      security: {
        title: "Account Security",
        desc: "Manage your credentials and authentication.",
        newPass: "New Password",
        confirmPass: "Confirm Password",
        updateBtn: "Update Password",
      }
    },
    faq: {
      title: "One question = One answer",
      desc: "Discover all the features of Content Factory.",
      searchPlaceholder: "Search for a feature...",
      categories: {
        generation: "Article Generation",
        edition: "Editing & Customization",
        language: "Languages & Support",
        security: "Security & Organization",
      },
      helpCards: {
        guide: "Advanced Guide",
        guideDesc: "Learn to master prompts to get ever more precise articles.",
        guideBtn: "Read guide",
        video: "Video Tutorial",
        videoDesc: "2 minutes to understand how to generate your first SEO-optimized article.",
        videoBtn: "Watch video",
      },
      data: [
        {
          category: "Article Generation",
          questions: [
            {
              q: "How does the Content Factory actually work?",
              a: "Our system is based on an orchestrated multi-agent architecture. A first agent (Research) uses Tavily to explore the web. A second (Planner) structures the topic. A third (Writer) generates the content, followed by an Optimization agent for human tone and an Evaluation agent that scores SEO quality, veracity, and readability."
            },
            {
              q: "Which AI models power the system?",
              a: "We leverage the power of Google Gemini (2.5 Pro, Flash, and Flash Lite) via Vertex AI. These models are chosen for their massive context window and superior reasoning capabilities, ensuring articles of over 2000 words with perfect consistency."
            },
            {
              q: "How is medical compliance (TCM) ensured?",
              a: "The system integrates an exhaustive glossary of the Chinese pharmacopoeia (Ginseng, Astragalus, etc.) and Calebasse Laboratory guidelines. Each generation respects the claims authorized by EU regulation 432/2012 for dietary supplements."
            }
          ]
        },
        {
          category: "Editing & Customization",
          questions: [
            {
              q: "Can I edit the generated structure?",
              a: "Absolutely. The Content Factory offers a table of contents (TOC) validation step. You can rename sections, change the order, or ask the AI to regenerate a specific axis before final writing."
            },
            {
              q: "Where are my articles exported?",
              a: "Once validated, your articles are automatically converted into Google Docs documents and uploaded to the organization's shared Drive folder, ready for publication."
            },
            {
              q: "What is the 'Evaluation Score'?",
              a: "Each article receives a score out of 100 based on 5 criteria: SEO, Clarity, Veracity, Anti-Plagiarism, and Human Tone. A score below 80 automatically triggers an additional optimization cycle by our agents."
            }
          ]
        },
        {
          category: "Languages & Support",
          questions: [
            {
              q: "Which languages are supported natively?",
              a: "We currently support French, English, and Chinese (Mandarin). The translation is comprehensive and maintains the terminological precision of Traditional Chinese Medicine."
            }
          ]
        },
        {
          category: "Security & Organization",
          questions: [
            {
              q: "Who has access to this tool?",
              a: "Access is strictly reserved for Calebasse members with an @calebasse.com email. Your research and content are isolated and protected within our private cloud infrastructure."
            }
          ]
        }
      ],
      noResults: "No results found for"
    },
    library: {
      title: "Library",
      desc: "Manage your generated and published content.",
      searchPlaceholder: "Search...",
      emptyState: "No articles found. Start by generating one!",
      table: {
        title: "Title",
        lang: "Language",
        status: "Status",
        score: "Score",
        date: "Date",
        actions: "Actions",
      },
      status: {
        completed: "Completed",
        waiting: "Validation required",
        inProgress: "In progress",
        draft: "Draft",
      },
      actions: {
        open: "Open",
        delete: "Delete",
        confirmDelete: "Do you really want to delete this article?",
      }
    },
    factory: {
      title: "Create a New Article",
      desc: "Define your topic and let AI write quality content for you.",
      settingsTitle: "Writing Settings",
      promptPlaceholder: "Start describing your article here... (Topic, angle, keywords, desired structure)",
      markdown: "Markdown supported",
      charCount: "characters",
      docsTitle: "Reference Documents (Optional)",
      docsDesc: "Add contextual files",
      dragDrop: "Drag and drop or click (PDF, DOCX)",
      footer: {
        cancel: "Cancel",
        ready: "Ready to write?",
        generating: "Writing in progress...",
        generate: "Generate",
      }
    },
    article: {
      tabs: {
        plan: "Plan Structure",
        content: "Article",
      },
      status: {
        loading: "Loading...",
        researching: "Research in progress...",
        generatingPlan: "AI is restructuring the plan...",
        writing: "AI is writing your article...",
        translating: "Smart translation...",
        finalizing: "Article finalized!",
        ready: "Plan structure ready!",
      },
      header: {
        back: "Back to dashboard",
        version: {
          fr: "French Version",
          en: "English Version",
          zh: "Chinese Version",
        },
        history: "History",
        regenerate: "Regenerate",
        save: "Save",
        exportDocx: "Download .docx",
        exportPdf: "Download .pdf",
        saveDrive: "Save to Drive",
      },
      editor: {
        placeholder: "No content generated yet",
        assistant: {
          title: "Advanced Writing Assistant",
          desc: "Ask AI to adjust the tone, deepen a point, or rephrase a section.",
          placeholder: "Ex: 'Make the tone more journalistic' or 'Add details about Ginseng'...",
          send: "Send",
          estimated: "Estimated time: ~2 minutes",
          validation: "Confirm and Launch writing",
        }
      },
      metadata: {
        title: "Status & Date",
        config: "Configuration",
        tokens: "Consumption (Tokens)",
        id: "Unique ID",
        date: "Date",
        time: "Time",
        status: "Status",
        tone: "Tone",
        language: "Language",
        length: "Length",
        words: "Words",
        wordsUnit: "words",
      },
      quality: {
        title: "Global Quality",
        excellent: "Excellent",
        toImprove: "Needs improvement",
        totalScore: "Global Score",
        scoreOutOf: "out of 100",
        criteriaFallback: "Evaluation details loading or not available for this article.",
        waitingEval: "Waiting for evaluation...",
        feedbackTitle: "Improvement",
        feedbackBadge: "Tips",
        criterion: "Criterion",
      },
      research: {
        title: "AI Analysis Lab",
        desc: "Exhaustive synthesis of sources and strategic orientations",
        synthesisTitle: "Lab Synthesis",
        serpTitle: "Web Search Performed",
        statsTitle: "Key Data & Figures",
        pointsTitle: "Points of Attention",
        anglesTitle: "Recommended Writing Angles",
        faqTitle: "Frequently Asked Questions (FAQ)",
        seoTitle: "Semantic Strategy & SEO",
        conceptsTitle: "Major Concepts",
        relatedTitle: "Related Terms",
        previewTitle: "Work Plan Preview (TOC)",
        suggestedTitle: "Suggested Title",
        sourceMapTitle: "Source Mapping",
        expert: "Expert",
        reliable: "Reliable",
        standard: "Standard",
        publishedOn: "Published on",
        noSources: "No specific sources listed.",
        noData: "No research data",
        searchMore: "Use the bar above to launch an analysis or wait for the initial synthesis.",
        corrupted: "Research data corrupted or unreadable.",
      },
      toc: {
        chooseAxis: "Choose another writing angle",
        regenerateBtn: "Generate a plan with this choice",
        generatingStatus: "Generation in progress...",
        chooseTitle: "Choose another title",
        assistantTitle: "Assistant Editor (Structure)",
        placeholder: "Ex: 'Add a part about...', 'Change the angle for...'",
        confirmRegen: "This will generate a completely new structure linked to this writing axis.",
        planValidated: "Plan Validated",
        deleteConfirm: "Delete this part?",
        selectedBadge: "Selected",
        fileSizeError: "File too large (max 5MB)",
        regenInfo: "Regeneration request sent...",
        useThisTitle: "Use this title: ",
        sectionLabel: "Section: ",
        sectionIncluding: " (including subsections: ",
        modifyLabel: "Modify ",
        regardingLabel: "Regarding ",
      }
    }
  },
    zh: {
      common: {
        save: "保存",
        cancel: "取消",
        loading: "加载中...",
        error: "发生错误",
        success: "成功！",
        delete: "删除",
        edit: "编辑",
        back: "返回",
        next: "下一步",
        finish: "完成",
        french: "法语",
        english: "英语",
        chinese: "中文",
      },
      nav: {
        dashboard: "仪表板",
        library: "内容库",
        factory: "内容工厂",
        settings: "设置",
        faq: "帮助中心",
        logout: "登出",
        admin: "管理员",
        menuLabel: "菜单",
        application: "应用",
      },
      home: {
        welcome: "您好，",
        welcomeDesc: "准备好创作您的下一个爆款内容了吗？",
        createArticle: "撰写文章",
        keywordPlaceholder: "输入关键词或主题...",
        optionsTitle: "生成选项",
        tone: "语调",
        length: "文章长度",
        language: "写作语言",
        generate: "生成大纲",
        tones: {
          professional: "专业",
          creative: "创意",
          informative: "信息丰富",
          humorous: "幽默",
        },
        lengths: {
          short: "短篇 (~500 字)",
          medium: "中等 (~1200 字)",
          long: "长篇 (+2000 字)",
        }
      },
      dashboard: {
        title: "仪表板",
        generateBtn: "撰写文章",
        stats: {
          articles: "已生成文章",
          totalDesc: "平台总计",
          avgScore: "平均分",
          avgDesc: "平均质量",
          waiting: "待处理",
          waitingDesc: "需要验证",
        },
        recent: {
          title: "最近生成",
          noArticles: "暂无文章。",
          open: "查看",
        }
      },
      settings: {
        title: "设置",
        desc: "个性化您的体验并管理系统偏好。",
        tabs: {
          profile: "个人资料",
          preferences: "偏好设置",
          tokens: "消费明细",
          security: "安全设置",
        },
        profile: {
          title: "用户资料",
          desc: "更新您的公开信息。",
          nameLabel: "全名",
          emailLabel: "工作邮箱",
          emailDesc: "工作邮箱不可更改。",
        },
        appearance: {
          title: "界面与外观",
          desc: "个性化您的内容工厂外观。",
          themeTitle: "视觉主题",
          themes: {
            light: "浅色",
            dark: "深色",
            system: "自动",
          },
          langTitle: "界面语言",
          langDesc: "决定菜单和按钮的语言。",
          notifTitle: "智能通知",
          notifDesc: "当 AI 完成复杂任务时收到提醒。",
        },
        usage: {
          title: "消费与配额",
          desc: "详细追踪您的 AI 资源。",
          total: "检测到的总消耗",
          tokens: "代币 (tokens)",
          plan: "最佳方案",
          research: "网页搜索与结构化",
          writing: "撰写与创意润色",
          eval: "事实核查与评分",
          note: "技术说明：消耗量基于 Gemini 2.5 Pro 模型计算。辅助操作使用 Gemini 2.5 Flash 和 Flash Lite。",
        },
        security: {
          title: "账户安全",
          desc: "管理您的凭据和身份验证。",
          newPass: "新密码",
          confirmPass: "确认新密码",
          updateBtn: "更新密码",
        }
      },
      faq: {
        title: "一问一答",
        desc: "了解内容工厂的所有功能。",
        searchPlaceholder: "搜索功能...",
        categories: {
          generation: "文章生成",
          edition: "编辑与个性化",
          language: "语言与支持",
          security: "安全与组织",
        },
        helpCards: {
          guide: "高级指南",
          guideDesc: "学习掌握提示词，获得更精准的文章。",
          guideBtn: "阅读指南",
          video: "视频教程",
          videoDesc: "2 分钟了解如何生成您的第一篇 SEO 优化文章。",
          videoBtn: "观看视频",
        },
        data: [
          {
            category: "文章生成",
            questions: [
              {
                q: "内容工厂是如何运作的？",
                a: "我们的系统基于编排的多智能体架构。第一个智能体（研究）使用 Tavily 探索网络。第二个（规划）构建主题结构。第三个（撰写）生成内容，随后是用于增强人类语调的优化智能体，以及对 SEO 质量、真实性和可读性进行评分的评估智能体。"
              },
              {
                q: "系统使用哪些 AI 模型？",
                a: "我们通过 Vertex AI 充分利用 Google Gemini (2.5 Pro, Flash 和 Flash Lite) 的强大功能。选择这些模型是因为它们拥有巨大的上下文窗口和卓越的推理能力，确保 2000 字以上的文章具有完美的连贯性。"
              },
              {
                q: "如何确保医疗合规性 (TCM)？",
                a: "系统集成了中药学（人参、黄芪等）的详尽术语库和 Calebasse 实验室指南。每一篇生成的内容都遵守欧盟 432/2012 法规关于膳食补充剂的授权声明。"
              }
            ]
          },
          {
            category: "编辑与个性化",
            questions: [
              {
                q: "我可以修改生成的结构吗？",
                a: "当然可以。内容工厂提供大纲 (TOC) 验证步骤。您可以在最终撰写之前重命名章节、更改顺序或要求 AI 重新生成特定的部分。"
              },
              {
                q: "我的文章导出到哪里？",
                a: "验证通过后，您的文章将自动转换为 Google Docs 文档并上传到组织的共享云端硬盘文件夹，以便发布。"
              },
              {
                q: "什么是“评估分数”？",
                a: "每篇文章都会根据 5 个标准获得 100 分制的评分：SEO、清晰度、真实性、防抄袭和人类语调。低于 80 分将自动触发我们的智能体进行额外的优化循环。"
              }
            ]
          },
          {
            category: "语言与支持",
            questions: [
              {
                q: "原生支持哪些语言？",
                a: "我们目前支持法语、英语和中文（普通话）。翻译是全方位的，并保持了中医术语的准确性。"
              }
            ]
          },
          {
            category: "安全与组织",
            questions: [
              {
                q: "谁可以使用这个工具？",
                a: "访问权限严格限于拥有 @calebasse.com 邮箱的 Calebasse 成员。您的研究和内容在我们的私有云基础架构中受到隔离和保护。"
              }
            ]
          }
        ],
        noResults: "未找到相关结果"
      },
      library: {
        title: "内容库",
        desc: "管理已生成和已发布的内容。",
        searchPlaceholder: "搜索...",
        emptyState: "未找到文章。从生成一篇开始吧！",
        table: {
          title: "标题",
          lang: "语言",
          status: "状态",
          score: "分数",
          date: "日期",
          actions: "操作",
        },
        status: {
          completed: "已完成",
          waiting: "需要验证",
          inProgress: "进行中",
          draft: "草稿",
        },
        actions: {
          open: "查看",
          delete: "删除",
          confirmDelete: "您确定要删除这篇文章吗？",
        }
      },
      factory: {
        title: "创建新文章",
        desc: "确定主题，让 AI 为您撰写高质量内容。",
        settingsTitle: "写作设置",
        promptPlaceholder: "在此开始描述您的文章...（主题、角度、关键词、期望结构）",
        markdown: "支持 Markdown",
        charCount: "字符",
        docsTitle: "参考文档（可选）",
        docsDesc: "添加背景文件",
        dragDrop: "拖放或点击（PDF, DOCX）",
        footer: {
          cancel: "取消",
          ready: "准备好写作了吗？",
          generating: "正在撰写...",
          generate: "生成",
        }
      },
      article: {
        tabs: {
          plan: "大纲结构",
          content: "文章正文",
        },
        status: {
          loading: "加载中...",
          researching: "正在研究...",
          generatingPlan: "AI 正在重构大纲...",
          writing: "AI 正在撰写文章...",
          translating: "智能翻译中...",
          finalizing: "文章已完成！",
          ready: "大纲结构已就绪！",
        },
        header: {
          back: "返回仪表板",
          version: {
            fr: "法语版本",
            en: "英语版本",
            zh: "中文版本",
          },
          history: "历史记录",
          regenerate: "重新生成",
          save: "保存文章",
          exportDocx: "下载 .docx",
          exportPdf: "下载 .pdf",
          saveDrive: "保存到云端硬盘",
        },
        editor: {
          placeholder: "暂无生成内容",
          assistant: {
            title: "高级写作助手",
            desc: "要求 AI 调整语调、深入探讨某一点或重述某个部分。",
            placeholder: "例如：“让语调更具新闻感”或“增加关于人参的细节”...",
            send: "发送",
            estimated: "预计时间：~2 分钟",
            validation: "确认并开始撰写",
          }
        },
        metadata: {
          title: "状态与日期",
          config: "配置选项",
          tokens: "Token 消耗",
          id: "唯一 ID",
          date: "日期",
          time: "时间",
          status: "状态",
          tone: "语调",
          language: "语言",
          length: "篇幅",
          words: "字数",
          wordsUnit: "字",
        },
        quality: {
          title: "整体质量",
          excellent: "优秀",
          toImprove: "待改进",
          totalScore: "总分",
          scoreOutOf: "满分 100",
          criteriaFallback: "评估详情正在加载或对于此文章不可用。",
          waitingEval: "等待评估中...",
          feedbackTitle: "改进建议",
          feedbackBadge: "提示",
          criterion: "标准",
        },
        research: {
          title: "AI 分析实验室",
          desc: "详尽的消息来源综合与战略导向",
          synthesisTitle: "实验室综合",
          serpTitle: "执行的网页搜索",
          statsTitle: "关键数据与数字",
          pointsTitle: "注意事项",
          anglesTitle: "推荐的写作角度",
          faqTitle: "常问问题 (FAQ)",
          seoTitle: "语义策略与 SEO",
          conceptsTitle: "主要概念",
          relatedTitle: "相关术语",
          previewTitle: "工作计划预览 (TOC)",
          suggestedTitle: "建议标题",
          sourceMapTitle: "来源图谱",
          expert: "专家",
          reliable: "可靠",
          standard: "标准",
          publishedOn: "发布于",
          noSources: "未具体列出来源。",
          noData: "暂无研究数据",
          searchMore: "使用上方搜索栏开始分析或等待初始综合结果。",
          corrupted: "研究数据损坏或无法读取。",
        },
        toc: {
          chooseAxis: "选择另一个写作角度",
          regenerateBtn: "使用此选择生成大纲",
          generatingStatus: "正在生成...",
          chooseTitle: "选择另一个标题",
          assistantTitle: "助理编辑器 (结构)",
          placeholder: "例如：‘增加关于...的部分’，‘更改角度为...’",
          confirmRegen: "这将生成一个与此写作轴心相关的全新结构。",
          planValidated: "大纲已验证",
          deleteConfirm: "删除此部分？",
          selectedBadge: "已选择",
          fileSizeError: "文件太大（最大 5MB）",
          regenInfo: "重生成请求已发送...",
          useThisTitle: "使用此标题：",
          sectionLabel: "第 {n} 部分 ",
          sectionIncluding: " (包含子章节：",
          modifyLabel: "修改 ",
          regardingLabel: "关于 ",
        }
      }
    }
};
