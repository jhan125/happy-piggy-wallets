import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Help() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Help Center</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I reset my password?</AccordionTrigger>
                <AccordionContent>
                  Click on the "Forgot Password" link on the login page. Enter your email address, and we'll send you instructions to reset your password.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>How can I update my account information?</AccordionTrigger>
                <AccordionContent>
                  Go to your Profile page by clicking on your avatar, then select "Edit Profile" to update your information.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                <AccordionContent>
                  We accept major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Need More Help?</h2>
            <p className="text-gray-700 mb-4">
              If you couldn't find the answer you're looking for, you can:
            </p>
            <ul className="list-disc list-inside text-gray-700">
              <li>Visit our <a href="/support" className="text-blue-600 hover:underline">Support Page</a></li>
              <li>Email us at support@example.com</li>
              <li>Call us at 1-800-EXAMPLE</li>
            </ul>
          </section>
        </div>
      </Card>
    </div>
  );
} 