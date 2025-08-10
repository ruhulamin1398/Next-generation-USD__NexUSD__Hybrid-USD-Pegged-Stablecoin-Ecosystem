// Footer link interfaces
export interface FooterLink {
  href: string;
  label: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  href: string;
  icon: string;
  label: string;
}

export interface FooterStats {
  label: string;
  value: string;
}
