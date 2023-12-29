import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRightIcon} from '@heroicons/react/solid';
import Layout from '/components/Layout.js';
import { supabase } from '@/utils/supabase';
import { useUser } from '/components/UserContext.js';

//this page is only available for webtrips administrator
//it's a dedicated page which display all the contact forms
export default function TravelsPage() {
  const [contacts, setContacts] = useState([]);
  const { darkMode  } = useUser();
  //to make a pagination, only 6/page
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(6);


  const fetchContacts = async () => {
    let { data, error } = await supabase
      .from('contacts')
      .select(`id, firstname, lastname, email, message, reply`);

      if (error) {
        console.log('Error: ', error);
      }
      setContacts(data || []);
    };
  

  useEffect(()=> {
    fetchContacts();
  });

  //to make a pagination, only 6/page
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = contacts.slice(indexOfFirstArticle, indexOfLastArticle);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Layout >
      <div className='mb-4 mt-32'>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentArticles
        .filter((contact) => contact.reply === false)
        .map((contact) => (
          <div
            key={contact.id}
            className={`bg-white overflow-hidden shadow rounded-lg`}
          >
            <div className="p-4">
              <h3 className="text-4xl font-bold mb-2 text-black">{contact.email}</h3>
              <p className="text-slate-500 mb-2">{contact.firstname} {contact.lastname} </p>
              <p className="text-slate-500 mt-2" dangerouslySetInnerHTML={{ __html: contact.message.slice(0, 100) + ' ....' }} />
            </div>
            <div className="p-4 flex justify-between items-center">
              <Link
                href={`/admin/contacts/${contact.id}`}
                passHref
                className={`flex w-18 h-5 rounded-lg block ${darkMode ? 'text-black bg-slate-200 hover:bg-blue-500' : 'text-black bg-slate-200 hover:bg-orange-500'} `}>
                    REPLY
                <ChevronRightIcon className="h-5 w-5 " aria-hidden="true" />
              </Link>

  
              
            </div>
          </div>
        ))}
      </div>
      {contacts.length > articlesPerPage && (
        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(contacts.length / articlesPerPage) }, (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`mx-2 px-3 py-1 rounded ${currentPage === index + 1 ? `bg-${darkMode ? 'blue' : 'orange'}-500 text-white` : 'bg-gray-300 text-gray-700'}`}
            
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
      </div>
    </Layout>
  );
}
