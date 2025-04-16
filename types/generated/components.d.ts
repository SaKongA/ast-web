import type { Schema, Struct } from '@strapi/strapi';

export interface InternationalCollaborationPartnerInstitute
  extends Struct.ComponentSchema {
  collectionName: 'components_international_collaboration_partner_institutes';
  info: {
    displayName: 'PartnerInstitute';
  };
  attributes: {
    collaborationDate: Schema.Attribute.Date;
    description: Schema.Attribute.Text;
    logo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    name: Schema.Attribute.String;
  };
}

export interface InternationalCollaborationPartnerScholar
  extends Struct.ComponentSchema {
  collectionName: 'components_international_collaboration_partner_scholars';
  info: {
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
      'international-collaboration.partner-institute': InternationalCollaborationPartnerInstitute;
      'international-collaboration.partner-scholar': InternationalCollaborationPartnerScholar;
    }
  }
}
