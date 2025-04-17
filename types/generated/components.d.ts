import type { Schema, Struct } from '@strapi/strapi';

export interface PartnerInstitutePartnerInstitute
  extends Struct.ComponentSchema {
  collectionName: 'components_partner_institute_partner_institutes';
  info: {
    description: '';
    displayName: 'PartnerInstitute';
  };
  attributes: {
    collaborationDate: Schema.Attribute.Date;
    description: Schema.Attribute.Text;
    logo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    name: Schema.Attribute.String;
  };
}

export interface PartnerScholarPartnerScholar extends Struct.ComponentSchema {
  collectionName: 'components_partner_scholar_partner_scholars';
  info: {
    description: '';
    displayName: 'PartnerScholar';
  };
  attributes: {
    collaborationDate: Schema.Attribute.Date;
    description: Schema.Attribute.Text;
    name: Schema.Attribute.String;
    photo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'partner-institute.partner-institute': PartnerInstitutePartnerInstitute;
      'partner-scholar.partner-scholar': PartnerScholarPartnerScholar;
    }
  }
}
