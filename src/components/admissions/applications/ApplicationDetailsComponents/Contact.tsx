'use client';
import { ApplicationType } from '@/definitions/admissions';
import { LuMapPin, LuMail, LuPhone } from 'react-icons/lu';

interface ContactAddressCardProps {
  applicationDetails: ApplicationType;
}

const ContactAddressCard = ({
  applicationDetails,
}: ContactAddressCardProps) => {
  return (
    <div className="space-y-4 p-5 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 border-b pb-3">
        <LuMapPin className="text-green-600" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">
          Contact & Address
        </h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-800">
          <LuMail className="text-gray-500" size={16} />
          <span>{applicationDetails.email}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-800">
          <LuPhone className="text-gray-500" size={16} />
          <span>{applicationDetails.phone_number}</span>
        </div>

        <div className="border-t pt-3 mt-3">
          <h4 className="font-medium text-gray-700 mb-2">Residence</h4>
          <p className="text-gray-800">
            {applicationDetails.address}
            {applicationDetails.postal_code &&
              `, ${applicationDetails.postal_code}`}
            <br />
            {applicationDetails.city}, {applicationDetails.country}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactAddressCard;
