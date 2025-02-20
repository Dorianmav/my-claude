import { useState } from 'react';
import { Chat } from './components/Chat';
import { Canva } from './components/Canva';
import CustomHeader from './components/CustomHeader';
import { ContentData } from './types';

function App() {
  const [showContent, setShowContent] = useState(false);
  const [contentData, setContentData] = useState<ContentData>();

  const handleContentGenerated = (data: ContentData) => {
    setContentData(data);
    setShowContent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col w-full">
      <CustomHeader isShow={showContent} setIsShow={setShowContent} />
      
      <div className="flex-1 flex">
        {/* Chat section - Adapts width based on showContent */}
        <div className={`transition-all duration-300 ease-in-out ${showContent ? 'w-1/2' : 'w-full'}`}>
          <Chat onContentGenerated={handleContentGenerated} />
        </div>

        {/* Content display section - Slides in/out */}
        <div 
          className={`w-1/2 transition-all duration-300 ease-in-out transform ${
            showContent ? 'translate-x-0' : 'translate-x-full'
          } fixed right-0 top-[88px] bottom-0 bg-white shadow-lg`}
        >
          {contentData && (
            <Canva 
              isShow={showContent}
              contentData={contentData}
              onClose={() => setShowContent(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
