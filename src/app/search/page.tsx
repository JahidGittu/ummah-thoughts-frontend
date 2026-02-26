import { Metadata } from 'next';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Search | Ummah Thoughts',
};

const SearchPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-xl w-full space-y-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-2">
          <Search className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Search across Ummah Thoughts
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          A richer search experience is coming soon inshaAllah. For now this is a
          placeholder so the search button does not lead to a broken page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Input
            placeholder="Type a topic, scholar, or battle..."
            className="sm:w-72"
            disabled
          />
          <Button disabled className="sm:w-28">
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

