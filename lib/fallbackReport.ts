import type { Answers, Report, ScoringResult } from "./types";
import { formatCurrency } from "./format";
import { BRAND, brokersInlineNames } from "./brand";

const VERDICT_HEADLINE = {
  favorable: "C'est le moment idéal !",
  moyen: "Vous êtes prêt(e) à vendre !",
  defavorable: "Vous n'êtes pas prêt(e) encore.",
} as const;

const PROPERTY_LABEL: Record<string, string> = {
  maison: "Maison unifamiliale",
  condo: "Condo",
  plex: "Plex",
  chalet: "Chalet",
};

const MOTIVATION_LABEL: Record<string, string> = {
  upsize: "Passer à plus grand",
  downsize: "Réduire / simplifier",
  relocation: "Déménager ailleurs",
  no_sell: "Pas de vente prévue",
};

export function buildFallbackReport(answers: Answers, scoring: ScoringResult): Report {
  const { score, verdict, metrics } = scoring;

  const summaryByVerdict = {
    favorable: `Avec ${metrics.yearsOwned} année${metrics.yearsOwned > 1 ? "s" : ""} de possession et votre situation actuelle, tous les signaux pointent vers une vente avantageuse. C'est rare d'avoir un alignement aussi complet — autant en profiter pendant que la fenêtre est ouverte.`,
    moyen: `Vous avez accumulé une bonne équité et votre situation s'y prête bien. Quelques optimisations préalables pourraient maximiser votre retour, mais vous pouvez clairement avancer vers une mise en marché.`,
    defavorable: `Quelques éléments freinent encore l'opportunité — équité, situation familiale ou financière. Mieux vaut consolider votre position avant de mettre en marché. Revenez nous voir dans 12 à 24 mois.`,
  };

  const marketInsightByVerdict = {
    favorable: `Le marché de ${BRAND.region} reste soutenu par la demande des acheteurs de ${BRAND.city} et des grands centres. Les propriétés bien préparées se vendent généralement en moins de 45 jours.`,
    moyen: `Le marché de ${BRAND.region} est en transition : les acheteurs prennent un peu plus de temps, mais les bonnes propriétés trouvent toujours preneur au juste prix.`,
    defavorable:
      "Le marché actuel favorise davantage les acheteurs sur certains segments. Patienter peut permettre de capitaliser sur une remontée des évaluations.",
  };

  const stats = [
    {
      label: "Score d'opportunité",
      value: `${score}/100`,
      detail:
        verdict === "favorable"
          ? "Conditions globalement réunies."
          : verdict === "moyen"
          ? "À optimiser avant de mettre en marché."
          : "Mieux vaut attendre.",
    },
    {
      label: "Années de possession",
      value: `${metrics.yearsOwned} an${metrics.yearsOwned > 1 ? "s" : ""}`,
      detail:
        metrics.yearsOwned >= 6
          ? "Équité bien établie."
          : metrics.yearsOwned >= 3
          ? "Équité en construction."
          : "Équité encore jeune.",
    },
    {
      label: "Valeur estimée",
      value: metrics.estimatedValue ? formatCurrency(metrics.estimatedValue) : "—",
      detail: "Selon votre estimation actuelle du marché.",
    },
    {
      label: "Motivation",
      value: answers.sellingMotivation ? MOTIVATION_LABEL[answers.sellingMotivation] : "—",
      detail: `Type : ${answers.propertyType ? PROPERTY_LABEL[answers.propertyType] : "—"}`,
    },
  ];

  const stepsFavorable = [
    {
      title: "Préparer votre dossier financier",
      description:
        "Réunir vos documents hypothécaires et fiscaux pour évaluer rapidement votre net après vente.",
    },
    {
      title: "Évaluation comparative (CMA)",
      description: `${brokersInlineNames()} vous transmettra une analyse comparative des dernières ventes dans votre secteur.`,
    },
    {
      title: "Plan de mise en marché",
      description:
        "Photos professionnelles, home staging léger, stratégie multi-plateforme adaptée à votre type de propriété.",
    },
    {
      title: "Stratégie de relogement",
      description:
        "On planifie la transition avant la vente pour éviter toute pression à signer une offre.",
    },
  ];

  const stepsMoyen = [
    {
      title: "Clarifier votre objectif financier",
      description:
        "Définir le net souhaité après vente pour valider si le marché actuel le permet.",
    },
    {
      title: "Optimiser la propriété",
      description:
        "Identifier 2-3 améliorations à fort levier (peinture, luminosité, espaces extérieurs).",
    },
    {
      title: "Tester la valeur",
      description:
        "Une analyse comparative récente vous donnera une fourchette réaliste avant d'engager des frais.",
    },
    {
      title: "Décider ensemble du timing",
      description:
        "Si les chiffres ne sont pas au rendez-vous, attendre 6 à 12 mois peut faire une différence notable.",
    },
  ];

  const stepsDefavorable = [
    {
      title: "Garder votre équité au travail",
      description:
        "Continuer à rembourser votre hypothèque renforce votre position pour la prochaine fenêtre.",
    },
    {
      title: "Suivre le marché de loin",
      description:
        "On peut vous envoyer une mise à jour annuelle sans aucun engagement, simplement à titre informatif.",
    },
    {
      title: "Améliorer la valeur perçue",
      description:
        "Petits travaux ciblés qui augmentent la valeur sans surinvestissement.",
    },
    {
      title: "Réévaluer dans 12 à 24 mois",
      description:
        "Vos coordonnées seront supprimées comme promis. Revenez nous voir quand vous serez prêt(e).",
    },
  ];

  const steps =
    verdict === "favorable" ? stepsFavorable : verdict === "moyen" ? stepsMoyen : stepsDefavorable;

  return {
    headline: VERDICT_HEADLINE[verdict],
    summary: summaryByVerdict[verdict],
    stats,
    steps,
    marketInsight: marketInsightByVerdict[verdict],
  };
}
